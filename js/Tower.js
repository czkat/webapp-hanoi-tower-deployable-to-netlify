class Tower {
    constructor(index) {
        this.index = index;
        this.disks = [];
        this.element = document.querySelector(`.tower[data-index="${index}"]`);
    }

    addDisk(disk) {
        this.disks.push(disk);
    }

    removeDisk() {
        return this.disks.pop();
    }

    getTopDisk() {
        if (this.disks.length === 0) return null;
        return this.disks[this.disks.length - 1];
    }

    getDisks() {
        return this.disks;
    }

    getElement() {
        return this.element;
    }

    getIndex() {
        return this.index;
    }

    isEmpty() {
        return this.disks.length === 0;
    }

    canAddDisk(disk) {
        if (this.isEmpty()) return true;
        return disk.getSize() < this.getTopDisk().getSize();
    }

    render() {
        this.element.innerHTML = '';
        this.disks.forEach(disk => {
            this.element.appendChild(disk.getElement());
        });
    }
}