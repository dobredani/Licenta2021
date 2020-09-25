# Iterable object holding all preview slot objects

class PreviewSlotsIterable:
    # iterate through all items when false and only through active items when true
    boolOnlyActive = False

    # list of preview slots
    slots = []

    def __iter__(self):
        self.index = 1
        return self

    def __next__(self):
        x = self.index

        if self.boolOnlyActive:
            while self.slots[(self.index)].isActive == False:
                self.index += 1
        return x
    
    def addSlot(self, objSlot):
        self.slots.append((objSlot.name, objSlot))

    def find(self, index):
        dictSlots = dict(self.slots)
        return dictSlots[index]