class AnimationManager {
    constructor(game) {
        this.game = game;
    }

    animateMove(from, to, duration) {
        const fromTower = document.querySelector(`.tower[data-index="${from}"]`);
        const toTower = document.querySelector(`.tower[data-index="${to}"]`);
        
        if (fromTower.lastChild === null) return;
        
        const diskToMove = fromTower.lastChild;
        if (!diskToMove) return;
        
        // Create a clone for animation
        const diskClone = diskToMove.cloneNode(true);
        document.body.appendChild(diskClone);
        
        // Position the clone at the source disk position
        const diskRect = diskToMove.getBoundingClientRect();
        const toTowerRect = toTower.getBoundingClientRect();
        
        diskClone.style.position = 'fixed';
        diskClone.style.left = `${diskRect.left}px`;
        diskClone.style.top = `${diskRect.top}px`;
        diskClone.style.zIndex = '1000';
        
        // Calculate destination position
        const destX = toTowerRect.left + (toTowerRect.width - diskRect.width) / 2;
        let destY;
        
        // Calculate the position based on existing disks in the target tower
        const targetTowerDisks = this.game.getTowers()[to].getDisks().length;
        destY = toTowerRect.bottom - diskRect.height - (targetTowerDisks * diskRect.height);
        
        // Hide the original disk during animation
        diskToMove.style.visibility = 'hidden';
        
        // Animate
        const startTime = performance.now();
        const animate = (currentTime) => {
            const elapsedTime = currentTime - startTime;
            const progress = Math.min(elapsedTime / duration, 1);
            
            const currentX = diskRect.left + (destX - diskRect.left) * progress;
            const currentY = diskRect.top + (destY - diskRect.top) * progress;
            
            diskClone.style.left = `${currentX}px`;
            diskClone.style.top = `${currentY}px`;
            
            if (progress < 1) {
                requestAnimationFrame(animate);
            } else {
                // Animation complete
                document.body.removeChild(diskClone);
                
                // Actually move the disk in the game state
                this.game.moveDisk(from, to);
            }
        };
        
        requestAnimationFrame(animate);
    }
}