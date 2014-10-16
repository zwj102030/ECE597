import Adafruit_BBIO.GPIO as GPIO
from time import sleep
import Image
import ImageDraw
from Adafruit_LED_Backpack import BicolorMatrix8x8
from eqep import eQEP

display = BicolorMatrix8x8.BicolorMatrix8x8()

eQEP1 = eQEP("/sys/devices/ocp.3/48302000.epwmss/48302180.eqep", eQEP.MODE_ABSOLUTE)
eQEP2 = eQEP("/sys/devices/ocp.3/48304000.epwmss/48304180.eqep", eQEP.MODE_ABSOLUTE)

eQEP1.set_period(100000000)
eQEP2.set_period(100000000)

display.begin()
display.clear()
display.write_display()

BUTTON_1 = "P9_12"
BUTTON_2 = "P9_25"
BUTTON_3 = "P9_29"
BUTTON_4 = "P9_41"
BUTTON_CLR = "P8_10"

LED_1 = "P9_14"
LED_2 = "P9_26"
LED_3 = "P9_30"
LED_4 = "P9_42"

GPIO.setup(BUTTON_1, GPIO.IN, pull_up_down=GPIO.PUD_DOWN)
GPIO.setup(BUTTON_2, GPIO.IN, pull_up_down=GPIO.PUD_DOWN)
GPIO.setup(BUTTON_3, GPIO.IN, pull_up_down=GPIO.PUD_DOWN)
GPIO.setup(BUTTON_4, GPIO.IN, pull_up_down=GPIO.PUD_DOWN)
GPIO.setup(BUTTON_CLR, GPIO.IN, pull_up_down=GPIO.PUD_DOWN)

GPIO.setup(LED_1, GPIO.OUT)
GPIO.setup(LED_2, GPIO.OUT)
GPIO.setup(LED_3, GPIO.OUT)
GPIO.setup(LED_4, GPIO.OUT)

GPIO.add_event_detect(BUTTON_1, GPIO.RISING)
GPIO.add_event_detect(BUTTON_2, GPIO.RISING)
GPIO.add_event_detect(BUTTON_3, GPIO.RISING)
GPIO.add_event_detect(BUTTON_4, GPIO.RISING)
GPIO.add_event_detect(BUTTON_CLR, GPIO.RISING)

size = 8
currentX = 0
currentY = 0
board = [[0 for col in range(size)] for row in range(size)]
board[currentX][currentY] = 1

board[currentX][currentY] = 1
display.set_pixel(currentX, currentY, 1)
display.write_display()

pos1_0 = eQEP1.get_position()
pos2_0 = eQEP2.get_position()

while (True):
    posX = currentX + (-(eQEP1.get_position() - pos1_0)/4)
    posY = currentY + (-(eQEP2.get_position() - pos2_0)/4)
    print posX, posY
    if ( posX >= 0 and posX < size and posY >= 0 and posY < size):
        display.set_pixel(posX, posY, 1)
        display.write_display()
        #sleep(0.2)
	if GPIO.event_detected(BUTTON_CLR):
		display.clear();
		display.write_display()
		sleep(0.2)
			

