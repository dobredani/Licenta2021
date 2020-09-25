# Object linked to a preview slot in the Transformed Grid View

class PreviewSlot:
    imgSlot = None
    isActive = False

    def __init__(self, name, index):
        self.name = name
        self.index = index

    def updateSlotDetails(self, window_controls):
        window_controls["-SLOT NAME-"].update(self.name)        
        window_controls["-SLOT ACTIVE-"].update(self.isActive)