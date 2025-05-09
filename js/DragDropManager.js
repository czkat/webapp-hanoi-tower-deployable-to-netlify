class DragDropManager {
    constructor(game) {
        this.game = game;
        this.setup();
    }

    setup() {
        // Set up drag start event handling
        document.addEventListener('dragstart', (e) => {
            if (e.target.classList.contains('disk')) {
                this.handleDragStart(e);
            }
        });

        // Set up towers as drop targets
        document.querySelectorAll('.tower').forEach(towerElement => {
            towerElement.addEventListener('dragover', e => e.preventDefault());
            towerElement.addEventListener('dragenter', e => e.preventDefault());
            towerElement.addEventListener('drop', e => this.handleDrop(e));
        });

        // Clean up when drag ends
        document.addEventListener('dragend', e => {
            if (e.target.classList.contains('disk')) {
                e.target.classList.remove('dragging');
            }
        });
    }

    handleDragStart(e) {
        if (this.game.isSolving()) return;
        
        const tower = e.target.parentElement;
        const towerIndex = parseInt(tower.dataset.index);
        const topDiskElement = tower.lastChild;
        
        // Only allow dragging the top disk
        if (e.target !== topDiskElement) {
            e.preventDefault();
            return;
        }
        
        e.dataTransfer.setData('text/plain', towerIndex);
        e.target.classList.add('dragging');
    }

    handleDrop(e) {
        e.preventDefault();
        const fromTowerIndex = parseInt(e.dataTransfer.getData('text/plain'));
        const toTowerIndex = parseInt(e.currentTarget.dataset.index);
        
        // Remove dragging class from all disks
        document.querySelectorAll('.disk').forEach(disk => {
            disk.classList.remove('dragging');
        });
        
        if (fromTowerIndex !== toTowerIndex) {
            this.game.moveDisk(fromTowerIndex, toTowerIndex);
        }
    }
}