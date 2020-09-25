import sys
import cv2 as cv
import numpy as np


def detect_circles(arg_img):

    # return arg_img

    ## [convert_to_gray]

    gray = np.copy(arg_img)
    # Convert it to gray
    if gray.ndim == 3:
        gray = cv.cvtColor(arg_img, cv.COLOR_BGR2GRAY)

    ## [convert_to_gray]

    ## [houghcircles]
    rows = gray.shape[0]
    circles = cv.HoughCircles(gray, cv.HOUGH_GRADIENT, 1, rows / 2,
                               param1=100, param2=50,
                               minRadius=70, maxRadius=230)
    ## [houghcircles]

    ## [draw]
    color=gray
    if circles is not None:
        color = cv.cvtColor(arg_img, cv.COLOR_GRAY2RGB)
        circles = np.uint16(np.around(circles))
        for i in circles[0, :]:
            center = (i[0], i[1])
            # circle center
            cv.circle(color, center, 1, (0, 100, 100), 3)
            # circle outline
            radius = i[2]
            cv.circle(color, center, radius, (255, 0, 255), 3)
    ## [draw]

    return color

