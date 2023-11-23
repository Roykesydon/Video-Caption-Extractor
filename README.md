# Video-Caption-Extractor

A simple web application to extract hardcoded captions from video.
It can detect the region you selected and extract the text inside it.

Depend on [EasyOCR](https://github.com/JaidedAI/EasyOCR)

- Currently supported languages: 
    - English
    - 簡體中文 + English
    - 繁體中文 + English

## Demo

Demo video source: [【老番茄】史上最快枪手](https://www.youtube.com/watch?v=EmUs5r3Z1B4&t=20s&ab_channel=%E8%80%81%E7%95%AA%E8%8C%84)

![](/demo/demo-gui.gif)
![](/demo/demo-result.png)

## Environment
- python 3.8.18

## How to use

1. Install the required packages using `pip install -r requirements.txt`
    - if you have problems while running this command, you can try to run `pip install easyocr flask` instead.

2. Run `python app.py` to start the application.

3. Use web app on "http://127.0.0.1:5000/"
