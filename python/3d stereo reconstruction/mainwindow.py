# img_viewer.py

import PySimpleGUI as sg
import os.path
import cv2 as cv
import numpy as np

# read files in the specified folder and fills the list of images
def fillImagesList():
    try:
        # Get list of files in folder
        file_list = os.listdir(folder)
    except:
        file_list = []

    fnames = [
        f
        for f in file_list
        if os.path.isfile(os.path.join(folder, f))
        and f.lower().endswith((".png", ".gif", ".jpg"))
    ]
    window_controls["-FILE LIST-"].update(fnames)

# Main controls window layout
file_list_column = [
    [
        sg.Text("Image Folder"),
        sg.In(size=(25, 1), enable_events=True, key="-FOLDER-"),
        sg.FolderBrowse(),
    ],
    [
        sg.Listbox(
            values=[], enable_events=True, size=(40, 20), key="-FILE LIST-"
        )
    ],
]

# Original image viewer layout
image_viewer_column = [
    [sg.Text(size=(40, 1), key="-TOUT-")],
    [sg.Image(key="-IMAGE-")],
]

# Image transformations layout
img_tranf_column1 = [
    [sg.Image(key="-TIMG11-", size=(50,50))],
    [sg.Image(key="-TIMG12-", size=(50,50))],
    [sg.Image(key="-TIMG13-", size=(50,50))],
]

img_tranf_column2 = [
    [sg.Image(key="-TIMG21-", size=(50,50))],
    [sg.Image(key="-TIMG22-", size=(50,50))],
    [sg.Image(key="-TIMG23-", size=(50,50))],
]

img_tranf_column3 = [
    [sg.Image(key="-TIMG31-", size=(50,50))],
    [sg.Image(key="-TIMG32-", size=(50,50))],
    [sg.Image(key="-TIMG33-", size=(50,50))],
]

layout_image_transformation = [[
    sg.Column(img_tranf_column1),
    sg.Column(img_tranf_column2),
    sg.Column(img_tranf_column3),
]]

# ----- Full layout -----
layout_controls = [
    [
        sg.Column(file_list_column),
        # sg.VSeperator(),
        # sg.Column(image_viewer_column),
    ]
]

layout_main_image = [
    [
        # sg.Column(file_list_column),
        # sg.VSeperator(),
        sg.Column(image_viewer_column),
    ]
]

window_controls = sg.Window("Control Panel", layout_controls)
window_main_image = sg.Window("Original Image", layout_main_image, resizable=True, grab_anywhere=True, disable_close=True)
window_img_transf = sg.Window("Transformed Images", layout_image_transformation, resizable=True, grab_anywhere=True, disable_close=True)

folder="F:\OLX Scraper Storage"
window_controls.read(timeout=100)
window_controls["-FOLDER-"].update(folder)
fillImagesList()

file11 = os.path.join(os.getcwd(),"slot11.png")
file12 = os.path.join(os.getcwd(),"slot12.png")
file13 = os.path.join(os.getcwd(),"slot13.png")
file21 = os.path.join(os.getcwd(),"slot21.png")
file22 = os.path.join(os.getcwd(),"slot22.png")
file23 = os.path.join(os.getcwd(),"slot23.png")
file31 = os.path.join(os.getcwd(),"slot31.png")
file32 = os.path.join(os.getcwd(),"slot32.png")
file33 = os.path.join(os.getcwd(),"slot33.png")

# Run the Event Loop
while True:
    event, values = window_controls.read(timeout=100)
    event2, values2 = window_main_image.read(timeout=100)
    event3, values3 = window_img_transf.read(timeout=100)

    if event == "Exit" or event == sg.WIN_CLOSED:
        break
    # Folder name was filled in, make a list of files in the folder
    if event == "-FOLDER-":
        folder = values["-FOLDER-"]
        fillImagesList

    elif event == "-FILE LIST-":  # A file was chosen from the listbox
        try:
            filename = os.path.join(
                values["-FOLDER-"], values["-FILE LIST-"][0]
            )
            window_main_image["-TOUT-"].update(filename)
            window_main_image["-IMAGE-"].update(filename=filename)

            src = cv.imread(cv.samples.findFile(filename), cv.IMREAD_COLOR)
            cv.imwrite("slot11.png",src)
            gray = cv.cvtColor(src, cv.COLOR_BGR2GRAY)
            cv.imwrite("slot12.png",gray)
            blur = cv.medianBlur(gray, 3)
            cv.imwrite("slot13.png",blur)
            blur = cv.medianBlur(gray, 13)
            cv.imwrite("slot21.png",blur)
            blur = cv.medianBlur(gray, 23)
            cv.imwrite("slot22.png",blur)
            blur = cv.medianBlur(gray, 33)
            cv.imwrite("slot23.png",blur)
            blur = cv.medianBlur(gray, 43)
            cv.imwrite("slot31.png",blur)
            blur = cv.medianBlur(gray, 53)
            cv.imwrite("slot32.png",blur)
            blur = cv.medianBlur(gray, 63)
            cv.imwrite("slot33.png",blur)

            if (os.path.exists(file11)) :
                window_img_transf["-TIMG11-"].update(filename=file11, size=(440,340))
            if (os.path.exists(file12)) :
                window_img_transf["-TIMG12-"].update(filename=file12, size=(440,340))
            if (os.path.exists(file13)) :
                window_img_transf["-TIMG13-"].update(filename=file13, size=(440,340))
            if (os.path.exists(file21)) :
                window_img_transf["-TIMG21-"].update(filename=file21, size=(440,340))
            if (os.path.exists(file22)) :
                window_img_transf["-TIMG22-"].update(filename=file22, size=(440,340))
            if (os.path.exists(file23)) :
                window_img_transf["-TIMG23-"].update(filename=file23, size=(440,340))
            if (os.path.exists(file31)) :
                window_img_transf["-TIMG31-"].update(filename=file31, size=(440,340))
            if (os.path.exists(file32)) :
                window_img_transf["-TIMG32-"].update(filename=file32, size=(440,340))
            if (os.path.exists(file33)) :
                window_img_transf["-TIMG33-"].update(filename=file33, size=(440,340))

        except:
            pass

window_controls.close()
window_main_image.close()

