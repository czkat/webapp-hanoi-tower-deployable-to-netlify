class Disk {
    constructor(size) {
        this.size = size;
        this.element = this.createDiskElement();
    }

    createDiskElement() {
        const disk = document.createElement('div');
        disk.className = `disk size-${this.size}`;
        disk.dataset.size = this.size;
        disk.style.width = `${40 + (this.size-1) * 20}px`;
        disk.textContent = this.size;
        disk.setAttribute('draggable', true);
        
        return disk;
    }

    getElement() {
        return this.element;
    }

    getSize() {
        return this.size;
    }
}