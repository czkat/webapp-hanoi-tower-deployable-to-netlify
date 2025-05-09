class Game {
    constructor() {
        this.towers = [];
        this.moveCount = 0;
        this.totalDisks = 3;
        this.solving = false;
        
        // Initialize managers
        this.logManager = new LogManager();
        this.animationManager = new AnimationManager(this);
        this.solver = new Solver(this);
        this.uiManager = new UIManager(this);
        this.dragDropManager = new DragDropManager(this);
        
        // Initialize towers
        for (let i = 0; i < 3; i++) {
            this.towers.push(new Tower(i));
        }
        
        this.initialize(this.totalDisks);
    }
    
    initialize(diskNumber) {
        this.totalDisks = diskNumber;
        this.moveCount = 0;
        this.solving = false;
        
        // Clear all towers
        this.towers.forEach(tower => tower.getDisks().length = 0);
        
        // Add disks to the first tower
        for (let i = diskNumber; i >= 1; i--) {
            const disk = new Disk(i);
            this.towers[0].addDisk(disk);
        }
        
        // Clear logs
        this.logManager.clear();
        
        // Clear any ongoing solving
        this.solver.clearTimeouts();
        
        // Update UI
        this.uiManager.updateStats();
        document.getElementById('hint').textContent = '';
        
        // Render the towers
        this.towers.forEach(tower => tower.render());
    }
    
    moveDisk(from, to) {
        const fromTower = this.towers[from];
        const toTower = this.towers[to];
        
        if (fromTower.isEmpty()) return false;
        
        const disk = fromTower.getTopDisk();
        
        if (toTower.canAddDisk(disk)) {
            const diskValue = disk.getSize();
            
            // Remove from source
            fromTower.removeDisk();
            
            // Add to destination
            toTower.addDisk(disk);
            
            // Update move count and log
            this.moveCount++;
            this.logManager.logMove(diskValue, from, to);
            
            // Update UI
            this.uiManager.updateStats();
            
            // Render towers
            fromTower.render();
            toTower.render();
            
            return true;
        }
        
        return false;
    }
    
    reset() {
        const diskSelect = document.getElementById('diskCount');
        const selectedDisks = parseInt(diskSelect.value);
        this.initialize(selectedDisks);
    }
    
    // Getters and setters
    getMoveCount() {
        return this.moveCount;
    }
    
    getTotalDisks() {
        return this.totalDisks;
    }
    
    getTowers() {
        return this.towers;
    }
    
    getLogManager() {
        return this.logManager;
    }
    
    getAnimationManager() {
        return this.animationManager;
    }
    
    getSolver() {
        return this.solver;
    }
    
    isSolving() {
        return this.solving;
    }
    
    setSolving(status) {
        this.solving = status;
    }
}