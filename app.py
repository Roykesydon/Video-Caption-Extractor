import cv2
import easyocr
import flask
from flask import request

app = flask.Flask(__name__)

DETECT_FRAME_PERIOD = 10  # detect every DETECT_FRAME_PERIOD frames
SIMILARITY_THRESHOLD = 0.5  # if current caption is not similar to previous caption, and the similarity is smaller than SIMILARITY_THRESHOLD, add it


@app.route("/")
def index():
    return flask.render_template("index.html")


@app.route("/upload_and_detect", methods=["POST"])
def detect_video():
    if "videoFile" not in request.files:
        return "No file part"

    file = request.files["videoFile"]
    coordinates = request.form.get("coordinates")
    language = request.form.get("language")

    print(coordinates, language)
    start_x, start_y, end_x, end_y = coordinates.split(",")
    # change it to int from float string
    start_x, start_y, end_x, end_y = (
        int(float(start_x)),
        int(float(start_y)),
        int(float(end_x)),
        int(float(end_y)),
    )

    # sort it as left top, right bottom
    if start_x > end_x:
        start_x, end_x = end_x, start_x
        start_y, end_y = end_y, start_y

    if file.filename == "":
        return "No selected file"

    file.save(f"upload/{file.filename}")

    language_list = ["en"]
    if language == "traditional":
        language_list.append("ch_tra")
    elif language == "simplified":
        language_list.append("ch_sim")

    reader = easyocr.Reader(
        language_list
    )  # this needs to run only once to load the model into memory
    caption_list = []

    vidcap = cv2.VideoCapture(f"upload/{file.filename}")

    count = 0
    while True:
        success, image = vidcap.read()
        count += 1
        # take picture for every DETECT_FRAME_PERIOD frames
        if count % DETECT_FRAME_PERIOD != 0:
            continue
        if success:
            # crop image
            image = image[int(start_y) : int(end_y), int(start_x) : int(end_x)]
            result = reader.readtext(image)
            # result to text
            result = "".join([r[1] for r in result])
            caption_list.append(result)

        if not success:
            break

    caption_list = [c.strip() for c in caption_list if len(c.strip()) > 0]

    # if caption is similar to previous caption, remove it
    filtered_caption_list = []
    for i in range(len(caption_list)):
        if len(filtered_caption_list) == 0:
            filtered_caption_list.append(caption_list[i])
            continue
        # calculate similarity
        similarity = 0
        for j in range(len(caption_list[i])):
            if caption_list[i][j] in filtered_caption_list[-1]:
                similarity += 1
        similarity /= len(caption_list[i])

        if similarity < SIMILARITY_THRESHOLD:
            filtered_caption_list.append(caption_list[i])

    # save caption text to file
    with open(f"caption/{file.filename}.txt", "w") as f:
        for caption in filtered_caption_list:
            if len(caption) == 0:
                continue
            f.write("".join(caption))
            f.write("\n")

    return flask.send_file(f"caption/{file.filename}.txt")


if __name__ == "__main__":
    app.run(host="0.0.0.0", debug=True)
