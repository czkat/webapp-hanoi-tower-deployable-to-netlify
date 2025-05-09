class Solver {
    constructor(game) {
        this.game = game;
        this.solvingTimeouts = [];
    }

    solve() {
        if (this.game.isSolving()) return;
        
        // Reset the game first
        this.game.reset();
        this.game.setSolving(true);
        
        // Set move durations
        const moveDuration = 500; // 0.5 seconds for the move
        const pauseDuration = 500; // 0.5 seconds pause between moves
        const totalStepTime = moveDuration + pauseDuration;
        
        // Queue to store all moves
        const moveQueue = [];
        
        // Recursive function to determine all moves needed
        const hanoiMoves = (n, source, auxiliary, destination) => {
            if (n === 0) return;
            
            // Move n-1 disks from source to auxiliary
            hanoiMoves(n-1, source, destination, auxiliary);
            
            // Move the nth disk from source to destination
            moveQueue.push([source, destination]);
            
            // Move n-1 disks from auxiliary to destination
            hanoiMoves(n-1, auxiliary, source, destination);
        };
        
        // Calculate all moves needed
        hanoiMoves(this.game.getTotalDisks(), 0, 1, 2);
        
        // Execute moves with animation
        moveQueue.forEach((move, index) => {
            const timeout = setTimeout(() => {
                const [from, to] = move;
                this.game.getAnimationManager().animateMove(from, to, moveDuration);
            }, index * totalStepTime);
            
            this.solvingTimeouts.push(timeout);
        });
        
        // Reset solving status after completion
        const finalTimeout = setTimeout(() => {
            this.game.setSolving(false);
        }, moveQueue.length * totalStepTime);
        
        this.solvingTimeouts.push(finalTimeout);
    }

    clearTimeouts() {
        this.solvingTimeouts.forEach(timeout => clearTimeout(timeout));
        this.solvingTimeouts = [];
    }
}