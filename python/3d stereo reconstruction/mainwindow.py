# img_viewer.py

import PySimpleGUI as sg
import os.path
import re

execfile("circles.py")
from classes.previewslot import PreviewSlot
from classes.previewslots import PreviewSlotsIterable

import cv2 as cv
import numpy as np

previewslot = None

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
    [
        sg.Button(button_text="Show Original", enable_events=True, key="-SHOW ORIGINAL-"),
        sg.Button(button_text="Show Gray", enable_events=True, key="-SHOW GRAY-"),
    ],
    [
        sg.Checkbox(text="Show Preview", default=True, enable_events=True, key="-SHOW PREVIEW-"),
        sg.Checkbox(text="Show Transformed", default=True, enable_events=True, key="-SHOW TRANSFORMED-"),
    ]
]

# selected slot details
slot_details_column = [
    [
        sg.Checkbox("Active", key="-SLOT ACTIVE-", enable_events=True),
    ]
]

# right hand side frame containing all the details of the selected slot
slot_details_frame_column = [
    [
        sg.Frame(title="Slot", layout = slot_details_column, key="-SLOT NAME-", size=(250,400)),
    ]
]

# Original image viewer layout
image_viewer_column = [
    [sg.Text(size=(40, 1), key="-TOUT-")],
    [sg.Image(key="-IMAGE-")],
]

# Image transformations layout
img_tranf_column1 = [
    [sg.Image(key="-TIMG11-", enable_events=True, tooltip="slot11")],
    [sg.Image(key="-TIMG12-", enable_events=True, tooltip="slot21")],
    [sg.Image(key="-TIMG13-", enable_events=True, tooltip="slot31")],
]

img_tranf_column2 = [
    [sg.Image(key="-TIMG21-", enable_events=True, tooltip="slot12")],
    [sg.Image(key="-TIMG22-", enable_events=True, tooltip="slot22")],
    [sg.Image(key="-TIMG23-", enable_events=True, tooltip="slot32")],
]

img_tranf_column3 = [
    [sg.Image(key="-TIMG31-", enable_events=True, tooltip="slot13")],
    [sg.Image(key="-TIMG32-", enable_events=True, tooltip="slot23")],
    [sg.Image(key="-TIMG33-", enable_events=True, tooltip="slot33")],
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
        sg.VSeperator(),
        sg.Column(slot_details_frame_column),
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
window_main_image = sg.Window("Preview", layout_main_image, location=(1600,-10), keep_on_top=True, no_titlebar=True, resizable=True, grab_anywhere=True, disable_close=True)
window_img_transf = sg.Window("Transformed Images", layout_image_transformation, location=(2640,-250), keep_on_top=True, no_titlebar=True, resizable=True, grab_anywhere=True, disable_close=True)
window_img_transf.Size = (600,600)

folder="F:\OLX Scraper Storage"
window_controls.read(timeout=100)
window_controls["-FOLDER-"].update(folder)
fillImagesList()

# create a list of objects for preview slots
previewslots = PreviewSlotsIterable()

for xi in range(1,4):
    for yi in range(1,4):
        objSlot = PreviewSlot("slot" + str(xi) + str(yi), str(xi) + str(yi))
        objSlot.imgSlot = window_img_transf["-TIMG" + str(xi) + str(yi) + "-"]
        previewslots.addSlot(objSlot)

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

    elif event == "-SHOW ORIGINAL-":
        file = os.path.join(os.getcwd(),"src.png")
        if (os.path.exists(file)) :
            window_main_image["-IMAGE-"].update(filename=file)

    elif event == "-SHOW GRAY-":
        file = os.path.join(os.getcwd(),"gray.png")
        if (os.path.exists(file)) :
            window_main_image["-IMAGE-"].update(filename=file)

    elif event == "-SHOW PREVIEW-":
        if values["-SHOW PREVIEW-"] == True:
            window_main_image.UnHide()
        else:
            window_main_image.Hide()
            
    elif event == "-SHOW TRANSFORMED-":
        if values["-SHOW TRANSFORMED-"] == True:
            window_img_transf.UnHide()
        else:
            window_img_transf.Hide()
            
    elif event == "-FILE LIST-":  # A file was chosen from the listbox
        try:
            filename = os.path.join(
                values["-FOLDER-"], values["-FILE LIST-"][0]
            )
            window_main_image["-TOUT-"].update(filename)
            window_main_image["-IMAGE-"].update(filename=filename)

            src = cv.imread(cv.samples.findFile(filename), cv.IMREAD_COLOR)
            cv.imwrite("src.png", src)

            gray = cv.cvtColor(src, cv.COLOR_BGR2GRAY)
            cv.imwrite("gray.png", gray)

            blur11 = cv.medianBlur(gray, 5)
            cv.imwrite("slot11.png", detect_circles(blur11))

            blur12 = cv.medianBlur(gray, 5)
            cv.imwrite("slot12.png", detect_circles(blur12))

            blur13 = cv.medianBlur(gray, 5)
            cv.imwrite("slot13.png", detect_circles(blur13))

            blur21 = cv.medianBlur(gray, 13)
            cv.imwrite("slot21.png", detect_circles(blur21))

            blur22 = cv.adaptiveThreshold(gray,255,cv.ADAPTIVE_THRESH_MEAN_C, cv.THRESH_BINARY,101,2)
            cv.imwrite("slot22.png", detect_circles(blur22))

            blur23 = cv.adaptiveThreshold(gray,155,cv.ADAPTIVE_THRESH_MEAN_C, cv.THRESH_BINARY,51,2) 
            cv.imwrite("slot23.png", detect_circles(blur23))

            blur31 = cv.adaptiveThreshold(gray,255,cv.ADAPTIVE_THRESH_GAUSSIAN_C, cv.THRESH_BINARY,11,20)
            cv.imwrite("slot31.png", detect_circles(blur31))

            blur32 = cv.adaptiveThreshold(gray,155,cv.ADAPTIVE_THRESH_GAUSSIAN_C, cv.THRESH_BINARY,11,2)
            cv.imwrite("slot32.png", detect_circles(blur32))

            blur33 = cv.medianBlur(gray, 7)
            cv.imwrite("slot33.png", detect_circles(blur33))

            if (os.path.exists(file11)) :
                window_img_transf["-TIMG11-"].update(filename=file11, size=(390,320))
            if (os.path.exists(file12)) :
                window_img_transf["-TIMG12-"].update(filename=file12, size=(390,320))
            if (os.path.exists(file13)) :
                window_img_transf["-TIMG13-"].update(filename=file13, size=(390,320))
            if (os.path.exists(file21)) :
                window_img_transf["-TIMG21-"].update(filename=file21, size=(390,320))
            if (os.path.exists(file22)) :
                window_img_transf["-TIMG22-"].update(filename=file22, size=(390,320))
            if (os.path.exists(file23)) :
                window_img_transf["-TIMG23-"].update(filename=file23, size=(390,320))
            if (os.path.exists(file31)) :
                window_img_transf["-TIMG31-"].update(filename=file31, size=(390,320))
            if (os.path.exists(file32)) :
                window_img_transf["-TIMG32-"].update(filename=file32, size=(390,320))
            if (os.path.exists(file33)) :
                window_img_transf["-TIMG33-"].update(filename=file33, size=(390,320))

        except:
            pass
    
    # cache slot details
    elif event == "-SLOT ACTIVE-" and previewslot != None:
        if previewslot != None:
            previewslot.isActive = values["-SLOT ACTIVE-"]

    # click event on slot in the 3x3 grid
    elif event3 != "__TIMEOUT__":
        regex = re.match("-TIMG(.*)-", event3)
        previewslot = previewslots.find("slot" + regex.group(1))

        if previewslot != None:
            previewslot.updateSlotDetails(window_controls)

        file = os.path.join(os.getcwd(),"slot"+ regex.group(1) + ".png")
        if (os.path.exists(file)) :
            window_main_image["-IMAGE-"].update(filename=file)

    # print(event)

window_controls.close()
window_main_image.close()

