class SignLanguageDetector {
    constructor() {
        this.video = document.getElementById('video');
        this.canvas = document.getElementById('canvas');
        this.ctx = this.canvas.getContext('2d');
        this.hands = null;
        this.camera = null;
        this.isRunning = false;
        this.currentGesture = null;
        this.gestureHistory = [];
        this.confidenceThreshold = 0.8;
        this.autoSpace = true;
        
        // Finger writing detection
        this.isWritingMode = false;
        this.writingPath = [];
        this.lastWritingPoint = null;
        this.writingTimeout = null;
        this.drawnLetters = [];
        this.pinchDistHistory = [];
        this.pinchAvgWindow = 6;
        
        // Comprehensive ASL Alphabet and Signs
        this.gestureMap = {
            // ASL Alphabet
            'A': 'A', 'B': 'B', 'C': 'C', 'D': 'D', 'E': 'E', 'F': 'F', 'G': 'G', 'H': 'H', 'I': 'I', 'J': 'J',
            'K': 'K', 'L': 'L', 'M': 'M', 'N': 'N', 'O': 'O', 'P': 'P', 'Q': 'Q', 'R': 'R', 'S': 'S', 'T': 'T',
            'U': 'U', 'V': 'V', 'W': 'W', 'X': 'X', 'Y': 'Y', 'Z': 'Z',
            
            // Numbers
            'zero': '0', 'one': '1', 'two': '2', 'three': '3', 'four': '4', 'five': '5',
            'six': '6', 'seven': '7', 'eight': '8', 'nine': '9', 'ten': '10',
            
            // Common Words and Phrases
            'hello': 'Hello', 'goodbye': 'Goodbye', 'thank_you': 'Thank you', 'please': 'Please',
            'yes': 'Yes', 'no': 'No', 'good': 'Good', 'bad': 'Bad', 'ok': 'OK',
            'help': 'Help', 'sorry': 'Sorry', 'excuse_me': 'Excuse me', 'understand': 'Understand',
            'dont_understand': "Don't understand", 'repeat': 'Repeat', 'slow': 'Slow',
            'name': 'Name', 'what': 'What', 'where': 'Where', 'when': 'When', 'why': 'Why',
            'how': 'How', 'who': 'Who', 'family': 'Family', 'friend': 'Friend', 'love': 'Love',
            'like': 'Like', 'dont_like': "Don't like", 'want': 'Want', 'need': 'Need',
            'eat': 'Eat', 'drink': 'Drink', 'sleep': 'Sleep', 'work': 'Work', 'play': 'Play',
            'learn': 'Learn', 'teach': 'Teach', 'school': 'School', 'home': 'Home',
            'time': 'Time', 'today': 'Today', 'tomorrow': 'Tomorrow', 'yesterday': 'Yesterday',
            'morning': 'Morning', 'afternoon': 'Afternoon', 'night': 'Night',
            'big': 'Big', 'small': 'Small', 'hot': 'Hot', 'cold': 'Cold', 'happy': 'Happy',
            'sad': 'Sad', 'angry': 'Angry', 'tired': 'Tired', 'sick': 'Sick', 'fine': 'Fine',
            
            // Gestures and Actions
            'thumbs_up': 'Good', 'thumbs_down': 'Bad', 'peace': 'Peace', 'wave': 'Hello',
            'call_me': 'Call me', 'fist': 'Stop', 'open_palm': 'Open', 'pointing': 'Point',
            'victory': 'Victory', 'rock_on': 'Rock on', 'clap': 'Clap', 'shh': 'Shh',
            'come_here': 'Come here', 'go_away': 'Go away', 'wait': 'Wait', 'hurry': 'Hurry',
            'stop': 'Stop', 'go': 'Go', 'look': 'Look', 'listen': 'Listen', 'think': 'Think',
            'know': 'Know', 'dont_know': "Don't know", 'remember': 'Remember', 'forget': 'Forget',
            
            // Colors
            'red': 'Red', 'blue': 'Blue', 'green': 'Green', 'yellow': 'Yellow', 'black': 'Black',
            'white': 'White', 'purple': 'Purple', 'orange': 'Orange', 'pink': 'Pink', 'brown': 'Brown',
            
            // Animals
            'dog': 'Dog', 'cat': 'Cat', 'bird': 'Bird', 'fish': 'Fish', 'horse': 'Horse',
            'cow': 'Cow', 'pig': 'Pig', 'sheep': 'Sheep', 'chicken': 'Chicken', 'duck': 'Duck',
            
            // Food and Drinks
            'water': 'Water', 'milk': 'Milk', 'coffee': 'Coffee', 'tea': 'Tea', 'bread': 'Bread',
            'meat': 'Meat', 'vegetables': 'Vegetables', 'fruit': 'Fruit', 'apple': 'Apple',
            'banana': 'Banana', 'orange': 'Orange', 'pizza': 'Pizza', 'hamburger': 'Hamburger',
            
            // Body Parts
            'head': 'Head', 'face': 'Face', 'eye': 'Eye', 'ear': 'Ear', 'nose': 'Nose',
            'mouth': 'Mouth', 'hand': 'Hand', 'arm': 'Arm', 'leg': 'Leg', 'foot': 'Foot',
            
            // Emotions and Feelings
            'happy': 'Happy', 'sad': 'Sad', 'angry': 'Angry', 'surprised': 'Surprised',
            'scared': 'Scared', 'excited': 'Excited', 'bored': 'Bored', 'confused': 'Confused',
            
            // Weather
            'sunny': 'Sunny', 'rainy': 'Rainy', 'snowy': 'Snowy', 'cloudy': 'Cloudy',
            'hot': 'Hot', 'cold': 'Cold', 'warm': 'Warm', 'cool': 'Cool',
            
            // Time and Calendar
            'monday': 'Monday', 'tuesday': 'Tuesday', 'wednesday': 'Wednesday',
            'thursday': 'Thursday', 'friday': 'Friday', 'saturday': 'Saturday', 'sunday': 'Sunday',
            'january': 'January', 'february': 'February', 'march': 'March', 'april': 'April',
            'may': 'May', 'june': 'June', 'july': 'July', 'august': 'August',
            'september': 'September', 'october': 'October', 'november': 'November', 'december': 'December'
        };
        
        this.initializeElements();
        this.setupEventListeners();
        this.initializeMediaPipe();

        // expose globally for shortcuts
        window.signDetector = this;
    }
    
    initializeElements() {
        this.startBtn = document.getElementById('startBtn');
        this.stopBtn = document.getElementById('stopBtn');
        this.clearBtn = document.getElementById('clearBtn');
        this.statusText = document.getElementById('statusText');
        this.statusDot = document.getElementById('statusDot');
        this.currentWord = document.getElementById('currentWord');
        this.fullText = document.getElementById('fullText');
        this.confidenceSlider = document.getElementById('confidenceSlider');
        this.confidenceValue = document.getElementById('confidenceValue');
        this.autoSpaceCheckbox = document.getElementById('autoSpace');
        
        // Writing controls
        this.enableWritingCheckbox = document.getElementById('enableWriting');
        this.writingSensitivitySlider = document.getElementById('writingSensitivity');
        this.writingSensitivityValue = document.getElementById('writingSensitivityValue');
        this.writingTimeoutInput = document.getElementById('writingTimeout');
        
        // Defaults
        this.enableWriting = true;
        // Slightly larger default threshold to reduce flicker
        this.pinchThreshold = parseFloat(this.writingSensitivitySlider?.value || 0.06);
        this.pinchOnThreshold = this.pinchThreshold;          // hysteresis: on below this
        this.pinchOffThreshold = this.pinchThreshold * 1.8;   // off above this
        this.isPinchingActive = false;
        this.strokeTimeoutMs = parseInt(this.writingTimeoutInput?.value || 1800, 10);
        this.confidenceThreshold = 0.75;
    }
    
    setupEventListeners() {
        this.startBtn.addEventListener('click', () => this.startCamera());
        this.stopBtn.addEventListener('click', () => this.stopCamera());
        this.clearBtn.addEventListener('click', () => this.clearText());
        
        this.confidenceSlider.addEventListener('input', (e) => {
            this.confidenceThreshold = parseFloat(e.target.value);
            this.confidenceValue.textContent = e.target.value;
        });
        
        this.autoSpaceCheckbox.addEventListener('change', (e) => {
            this.autoSpace = e.target.checked;
        });
        
        // Writing settings
        if (this.enableWritingCheckbox) {
            this.enableWritingCheckbox.addEventListener('change', (e) => {
                this.enableWriting = e.target.checked;
            });
        }
        if (this.writingSensitivitySlider) {
            this.writingSensitivitySlider.addEventListener('input', (e) => {
                this.pinchThreshold = parseFloat(e.target.value);
                this.pinchOnThreshold = this.pinchThreshold;
                this.pinchOffThreshold = this.pinchThreshold * 1.8;
                if (this.writingSensitivityValue) this.writingSensitivityValue.textContent = e.target.value;
            });
        }
        if (this.writingTimeoutInput) {
            this.writingTimeoutInput.addEventListener('input', (e) => {
                this.strokeTimeoutMs = parseInt(e.target.value || '1200', 10);
            });
        }
    }
    
    async initializeMediaPipe() {
        try {
            this.hands = new Hands({
                locateFile: (file) => {
                    return `https://cdn.jsdelivr.net/npm/@mediapipe/hands/${file}`;
                }
            });
            
            this.hands.setOptions({
                maxNumHands: 1,
                modelComplexity: 1,
                minDetectionConfidence: 0.5,
                minTrackingConfidence: 0.5
            });
            
            this.hands.onResults((results) => this.onResults(results));
            
            this.updateStatus('MediaPipe initialized', 'active');
        } catch (error) {
            console.error('Error initializing MediaPipe:', error);
            this.updateStatus('Error initializing MediaPipe', 'error');
        }
    }
    
    async startCamera() {
        try {
            this.camera = new Camera(this.video, {
                onFrame: async () => {
                    if (this.isRunning) {
                        await this.hands.send({image: this.video});
                    }
                },
                width: 640,
                height: 480
            });
            
            await this.camera.start();
            this.isRunning = true;
            this.startBtn.disabled = true;
            this.stopBtn.disabled = false;
            this.updateStatus('Camera active - Detecting gestures', 'active');
            
        } catch (error) {
            console.error('Error starting camera:', error);
            this.updateStatus('Error starting camera', 'error');
        }
    }
    
    stopCamera() {
        if (this.camera) {
            this.camera.stop();
        }
        this.isRunning = false;
        this.startBtn.disabled = false;
        this.stopBtn.disabled = true;
        this.updateStatus('Camera stopped', 'inactive');
    }
    
    onResults(results) {
        this.canvas.width = this.video.videoWidth;
        this.canvas.height = this.video.videoHeight;
        
        this.ctx.save();
        this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
        this.ctx.drawImage(results.image, 0, 0, this.canvas.width, this.canvas.height);
        
        if (results.multiHandLandmarks) {
            for (const landmarks of results.multiHandLandmarks) {
                this.drawConnectors(this.ctx, landmarks, HAND_CONNECTIONS, {
                    color: '#00FF00',
                    lineWidth: 2
                });
                this.drawLandmarks(this.ctx, landmarks, {
                    color: '#FF0000',
                    lineWidth: 1,
                    radius: 3
                });
                
                // Check for writing mode
                this.detectWritingMode(landmarks);
                
                // Analyze gesture
                const gesture = this.analyzeGesture(landmarks);
                if (gesture && gesture.confidence > this.confidenceThreshold) {
                    this.processGesture(gesture);
                }
            }
        }
        
        // Draw writing path if in writing mode
        if (this.isWritingMode && this.writingPath.length > 1) {
            this.drawWritingPath();
        }
        
        this.ctx.restore();
    }

    detectWritingMode(landmarks) {
        if (!this.enableWriting) return;
        const thumb = landmarks[4];
        const index = landmarks[8];
        const wrist = landmarks[0];
        const middle = landmarks[12];
        const ring = landmarks[16];
        const pinky = landmarks[20];

        // Pinch distance in normalized coords
        const pinchDistRaw = Math.hypot(thumb.x - index.x, thumb.y - index.y);
        // Temporal smoothing of pinch distance
        this.pinchDistHistory.push(pinchDistRaw);
        if (this.pinchDistHistory.length > this.pinchAvgWindow) this.pinchDistHistory.shift();
        const pinchDist = this.pinchDistHistory.reduce((a,b)=>a+b,0) / this.pinchDistHistory.length;

        // Hysteresis: once active, require a larger distance to turn off
        if (!this.isPinchingActive && pinchDist < this.pinchOnThreshold) {
            this.isPinchingActive = true;
            this.startWritingMode();
        } else if (this.isPinchingActive && pinchDist > this.pinchOffThreshold) {
            this.isPinchingActive = false;
            this.stopWritingMode();
        }

        // Alternative activation: index-only pose (index up, others down)
        const indexOnlyPose = (index.y < landmarks[6].y) && (middle.y > landmarks[10].y) && (ring.y > landmarks[14].y) && (pinky.y > landmarks[18].y);
        if (!this.isPinchingActive && indexOnlyPose) {
            this.isPinchingActive = true;
            this.startWritingMode();
        }

        // Debounce deactivation when leaving index-only pose
        if (this.isPinchingActive && !indexOnlyPose && pinchDist > this.pinchOffThreshold) {
            if (this._writeOffTimer) clearTimeout(this._writeOffTimer);
            this._writeOffTimer = setTimeout(() => {
                if (this.isPinchingActive && !indexOnlyPose) {
                    this.isPinchingActive = false;
                    this.stopWritingMode();
                }
            }, 220);
        }

        if (this.isPinchingActive) {
            // Continue stroke using index tip
            this.updateWritingPath(index, true);
            this.statusText.textContent = 'Writing...';
        }
    }

    startWritingMode() {
        this.isWritingMode = true;
        this.writingPath = [];
        this.updateStatus('Writing mode active - Pinch to draw', 'active');
    }
    
    stopWritingMode() {
        if (this.writingPath.length > 6) {
            // Resample path to uniform points for robust recognition
            const resampled = this.resamplePath(this.writingPath, 96);
            this.writingPath = resampled;
            this.recognizeDrawnLetter();
        }
        this.isWritingMode = false;
        this.writingPath = [];
        this.lastWritingPoint = null;
        this.updateStatus('Camera active - Detecting gestures', 'active');
    }

    updateWritingPath(indexFinger, applySmoothing = false) {
        const point = {
            x: indexFinger.x * this.canvas.width,
            y: indexFinger.y * this.canvas.height,
            timestamp: Date.now()
        };

        // Basic rejection of jitter
        if (this.lastWritingPoint) {
            const dx = point.x - this.lastWritingPoint.x;
            const dy = point.y - this.lastWritingPoint.y;
            const dist = Math.hypot(dx, dy);
            // ignore micro-moves to reduce dizzyness
            if (dist < 4) return;
        }

        // Smoothing with simple exponential moving average
        let smoothed = point;
        if (applySmoothing && this.lastWritingPoint) {
            const alpha = 0.18; // stronger smoothing
            smoothed = {
                x: this.lastWritingPoint.x + alpha * (point.x - this.lastWritingPoint.x),
                y: this.lastWritingPoint.y + alpha * (point.y - this.lastWritingPoint.y),
                timestamp: point.timestamp
            };
        }

        this.writingPath.push(smoothed);
        this.lastWritingPoint = smoothed;

        // Stroke timeout handling
        if (this.writingTimeout) clearTimeout(this.writingTimeout);
        this.writingTimeout = setTimeout(() => {
            if (this.isWritingMode) this.stopWritingMode();
        }, this.strokeTimeoutMs);
    }
    
    drawWritingPath() {
        this.ctx.strokeStyle = '#FF6B6B';
        this.ctx.lineWidth = 4;
        this.ctx.lineCap = 'round';
        this.ctx.lineJoin = 'round';
        
        this.ctx.beginPath();
        this.ctx.moveTo(this.writingPath[0].x, this.writingPath[0].y);
        
        for (let i = 1; i < this.writingPath.length; i++) {
            this.ctx.lineTo(this.writingPath[i].x, this.writingPath[i].y);
        }
        
        this.ctx.stroke();
    }
    
    recognizeDrawnLetter() {
        if (this.writingPath.length < 8) return;
        const letter = this.analyzeWritingPath();
        if (letter) {
            // Append directly to full text to build words quickly
            this.fullText.textContent += (this.autoSpace ? '' : '') + letter;
            this.currentWord.textContent = letter;
        } else {
            this.currentWord.textContent = 'Unrecognized stroke';
        }
    }
    
    analyzeWritingPath() {
        // Get path characteristics
        const bounds = this.getPathBounds();
        const pathLength = this.getPathLength();
        const direction = this.getPathDirection();
        const complexity = this.getPathComplexity();
        const inflections = this.countInflections();
        
        // Simple letter recognition based on path characteristics
        if (pathLength < 50) return null; // Too short
        
        // Vertical line (I, L, T)
        if (direction.vertical > 0.7 && direction.horizontal < 0.3) {
            if (complexity < 0.2) return 'I';
            if (bounds.width < bounds.height * 0.3) return 'L';
            if (complexity >= 0.2 && bounds.width >= bounds.height * 0.3) return 'T';
        }
        
        // Horizontal line (H, E, F)
        if (direction.horizontal > 0.7 && direction.vertical < 0.3) {
            if (complexity > 0.5) return 'E';
            if (complexity > 0.3) return 'F';
            return 'H';
        }
        
        // Circle (O, Q)
        if (this.isCircularPath()) {
            return 'O';
        }
        
        // Cross (X, T)
        if (this.isCrossPath()) {
            return 'X';
        }
        
        // Curved path (C, S)
        if (this.isCurvedPath()) {
            // S typically has multiple inflection points (direction reversals)
            if (inflections >= 2 && complexity > 0.35 && bounds.height > bounds.width * 0.6) {
                return 'S';
            }
            return 'C';
        }
        
        // V shape
        if (this.isVShape()) {
            return 'V';
        }
        
        // W shape
        if (this.isWShape()) {
            return 'W';
        }
        
        // U shape
        if (this.isUShape()) {
            return 'U';
        }
        
        // A shape (triangle)
        if (this.isTrianglePath()) {
            return 'A';
        }
        
        // M shape
        if (this.isMShape()) {
            return 'M';
        }
        
        // N shape
        if (this.isNShape()) {
            return 'N';
        }
        
        // Z shape
        if (this.isZShape()) {
            return 'Z';
        }

        // H, J, Y heuristics for easier writing
        if (complexity > 0.25 && direction.horizontal > 0.4 && direction.vertical > 0.4) return 'H';
        if (direction.vertical > 0.6 && this.isCurvedPath() && bounds.width > bounds.height * 0.3) return 'J';
        if (this.isVShape() && direction.vertical > 0.4) return 'Y';
        
        return null;
    }
    
    getPathBounds() {
        let minX = Infinity, minY = Infinity, maxX = -Infinity, maxY = -Infinity;
        
        for (const point of this.writingPath) {
            minX = Math.min(minX, point.x);
            minY = Math.min(minY, point.y);
            maxX = Math.max(maxX, point.x);
            maxY = Math.max(maxY, point.y);
        }
        
        return {
            width: maxX - minX,
            height: maxY - minY,
            minX, minY, maxX, maxY
        };
    }
    
    getPathLength() {
        let length = 0;
        for (let i = 1; i < this.writingPath.length; i++) {
            const dx = this.writingPath[i].x - this.writingPath[i-1].x;
            const dy = this.writingPath[i].y - this.writingPath[i-1].y;
            length += Math.sqrt(dx*dx + dy*dy);
        }
        return length;
    }
    
    getPathDirection() {
        if (this.writingPath.length < 2) return { horizontal: 0, vertical: 0 };
        
        const bounds = this.getPathBounds();
        const totalDistance = Math.sqrt(bounds.width*bounds.width + bounds.height*bounds.height);
        
        return {
            horizontal: bounds.width / totalDistance,
            vertical: bounds.height / totalDistance
        };
    }
    
    getPathComplexity() {
        // Calculate how complex the path is (more direction changes = more complex)
        let directionChanges = 0;
        for (let i = 2; i < this.writingPath.length; i++) {
            const dx1 = this.writingPath[i-1].x - this.writingPath[i-2].x;
            const dy1 = this.writingPath[i-1].y - this.writingPath[i-2].y;
            const dx2 = this.writingPath[i].x - this.writingPath[i-1].x;
            const dy2 = this.writingPath[i].y - this.writingPath[i-1].y;
            
            const angle1 = Math.atan2(dy1, dx1);
            const angle2 = Math.atan2(dy2, dx2);
            const angleDiff = Math.abs(angle1 - angle2);
            
            if (angleDiff > Math.PI / 4) { // 45 degrees
                directionChanges++;
            }
        }
        
        return directionChanges / this.writingPath.length;
    }
    
    isCircularPath() {
        const bounds = this.getPathBounds();
        const centerX = (bounds.minX + bounds.maxX) / 2;
        const centerY = (bounds.minY + bounds.maxY) / 2;
        const radius = Math.min(bounds.width, bounds.height) / 2;
        
        let circularPoints = 0;
        for (const point of this.writingPath) {
            const distance = Math.sqrt((point.x - centerX)**2 + (point.y - centerY)**2);
            if (Math.abs(distance - radius) < radius * 0.3) {
                circularPoints++;
            }
        }
        
        return circularPoints / this.writingPath.length > 0.6;
    }
    
    isCrossPath() {
        const bounds = this.getPathBounds();
        const centerX = (bounds.minX + bounds.maxX) / 2;
        const centerY = (bounds.minY + bounds.maxY) / 2;
        
        let horizontalLine = false, verticalLine = false;
        
        // Check for horizontal line
        for (let i = 1; i < this.writingPath.length; i++) {
            const dx = Math.abs(this.writingPath[i].x - this.writingPath[i-1].x);
            const dy = Math.abs(this.writingPath[i].y - this.writingPath[i-1].y);
            if (dx > dy * 3) horizontalLine = true;
            if (dy > dx * 3) verticalLine = true;
        }
        
        return horizontalLine && verticalLine;
    }
    
    isCurvedPath() {
        const bounds = this.getPathBounds();
        // Curved if elongated and not close to straight line
        return (bounds.width > bounds.height * 0.7 && bounds.height > bounds.width * 0.7);
    }
    
    isVShape() {
        if (this.writingPath.length < 3) return false;
        
        const bounds = this.getPathBounds();
        const centerX = (bounds.minX + bounds.maxX) / 2;
        
        // Check if path goes down and then splits into two directions
        let leftPoints = 0, rightPoints = 0;
        for (const point of this.writingPath) {
            if (point.x < centerX) leftPoints++;
            else rightPoints++;
        }
        
        return leftPoints > 0 && rightPoints > 0 && 
               Math.abs(leftPoints - rightPoints) < Math.max(leftPoints, rightPoints) * 0.5;
    }
    
    isWShape() {
        return this.getPathComplexity() > 0.4 && this.writingPath.length > 10;
    }
    
    isUShape() {
        const bounds = this.getPathBounds();
        return bounds.width > bounds.height * 1.2 && this.getPathComplexity() < 0.3;
    }
    
    isTrianglePath() {
        const bounds = this.getPathBounds();
        return Math.abs(bounds.width - bounds.height) < Math.max(bounds.width, bounds.height) * 0.3;
    }
    
    isMShape() {
        return this.getPathComplexity() > 0.5 && this.writingPath.length > 15;
    }
    
    isNShape() {
        return this.getPathComplexity() > 0.3 && this.writingPath.length > 12;
    }
    
    isZShape() {
        const bounds = this.getPathBounds();
        return bounds.width > bounds.height * 1.5 && this.getPathComplexity() > 0.4;
    }
    
    analyzeGesture(landmarks) {
        const gesture = this.classifyGesture(landmarks);
        return gesture;
    }
    
    classifyGesture(landmarks) {
        // Extract key points
        const thumb = landmarks[4];
        const index = landmarks[8];
        const middle = landmarks[12];
        const ring = landmarks[16];
        const pinky = landmarks[20];
        const wrist = landmarks[0];
        
        // Calculate finger states
        const thumbUp = this.isFingerUp(thumb, landmarks[3], wrist);
        const indexUp = this.isFingerUp(index, landmarks[6], wrist);
        const middleUp = this.isFingerUp(middle, landmarks[10], wrist);
        const ringUp = this.isFingerUp(ring, landmarks[14], wrist);
        const pinkyUp = this.isFingerUp(pinky, landmarks[18], wrist);
        
        // Gesture classification logic
        const fingerStates = [thumbUp, indexUp, middleUp, ringUp, pinkyUp];
        const upFingers = fingerStates.filter(state => state).length;
        
        // ASL Alphabet Recognition
        const alphabetGesture = this.recognizeASLAlphabet(landmarks, fingerStates);
        if (alphabetGesture) return alphabetGesture;
        
        // Number Recognition
        const numberGesture = this.recognizeNumbers(fingerStates, landmarks);
        if (numberGesture) return numberGesture;
        
        // Common Signs Recognition
        const commonSign = this.recognizeCommonSigns(landmarks, fingerStates);
        if (commonSign) return commonSign;
        
        // Basic Gestures (fallback)
        return this.recognizeBasicGestures(fingerStates, landmarks);
    }
    
    recognizeASLAlphabet(landmarks, fingerStates) {
        const [thumbUp, indexUp, middleUp, ringUp, pinkyUp] = fingerStates;
        const thumb = landmarks[4];
        const index = landmarks[8];
        const middle = landmarks[12];
        const ring = landmarks[16];
        const pinky = landmarks[20];
        const wrist = landmarks[0];
        
        // A - Fist with thumb on side
        if (!thumbUp && !indexUp && !middleUp && !ringUp && !pinkyUp) {
            return { gesture: 'A', confidence: 0.9 };
        }
        
        // B - All fingers extended, thumb tucked
        if (!thumbUp && indexUp && middleUp && ringUp && pinkyUp) {
            return { gesture: 'B', confidence: 0.9 };
        }
        
        // C - Curved hand like letter C
        if (this.isCurvedHand(landmarks)) {
            return { gesture: 'C', confidence: 0.85 };
        }
        
        // D - Index finger pointing up, others closed
        if (!thumbUp && indexUp && !middleUp && !ringUp && !pinkyUp) {
            return { gesture: 'D', confidence: 0.9 };
        }
        
        // E - All fingers curved down
        if (this.isCurvedDownHand(landmarks)) {
            return { gesture: 'E', confidence: 0.85 };
        }
        
        // F - Thumb and index touching, other fingers up
        if (this.isFShape(landmarks)) {
            return { gesture: 'F', confidence: 0.9 };
        }
        
        // G - Index pointing, thumb extended
        if (thumbUp && indexUp && !middleUp && !ringUp && !pinkyUp) {
            return { gesture: 'G', confidence: 0.85 };
        }
        
        // H - Index and middle fingers extended, close together
        if (!thumbUp && indexUp && middleUp && !ringUp && !pinkyUp) {
            return { gesture: 'H', confidence: 0.9 };
        }
        
        // I - Pinky extended, others closed
        if (!thumbUp && !indexUp && !middleUp && !ringUp && pinkyUp) {
            return { gesture: 'I', confidence: 0.9 };
        }
        
        // J - Pinky extended, moving in J motion
        if (!thumbUp && !indexUp && !middleUp && !ringUp && pinkyUp) {
            return { gesture: 'J', confidence: 0.8 };
        }
        
        // K - Index and middle extended, spread apart
        if (!thumbUp && indexUp && middleUp && !ringUp && !pinkyUp) {
            return { gesture: 'K', confidence: 0.85 };
        }
        
        // L - Thumb and index forming L shape
        if (thumbUp && indexUp && !middleUp && !ringUp && !pinkyUp) {
            return { gesture: 'L', confidence: 0.9 };
        }
        
        // M - Three fingers down, thumb tucked
        if (!thumbUp && !indexUp && !middleUp && !ringUp && pinkyUp) {
            return { gesture: 'M', confidence: 0.85 };
        }
        
        // N - Two fingers down, thumb tucked
        if (!thumbUp && !indexUp && !middleUp && ringUp && pinkyUp) {
            return { gesture: 'N', confidence: 0.85 };
        }
        
        // O - Fingers curved to form circle
        if (this.isOCircle(landmarks)) {
            return { gesture: 'O', confidence: 0.9 };
        }
        
        // P - Index pointing down, thumb extended
        if (thumbUp && indexUp && !middleUp && !ringUp && !pinkyUp) {
            return { gesture: 'P', confidence: 0.8 };
        }
        
        // Q - Index pointing down, thumb extended
        if (thumbUp && indexUp && !middleUp && !ringUp && !pinkyUp) {
            return { gesture: 'Q', confidence: 0.8 };
        }
        
        // R - Index and middle crossed
        if (!thumbUp && indexUp && middleUp && !ringUp && !pinkyUp) {
            return { gesture: 'R', confidence: 0.85 };
        }
        
        // S - Fist with thumb over fingers
        if (!thumbUp && !indexUp && !middleUp && !ringUp && !pinkyUp) {
            return { gesture: 'S', confidence: 0.9 };
        }
        
        // T - Index pointing up between middle and ring
        if (!thumbUp && indexUp && !middleUp && !ringUp && !pinkyUp) {
            return { gesture: 'T', confidence: 0.85 };
        }
        
        // U - Index and middle fingers together, pointing up
        if (!thumbUp && indexUp && middleUp && !ringUp && !pinkyUp) {
            return { gesture: 'U', confidence: 0.9 };
        }
        
        // V - Index and middle fingers spread, pointing up
        if (!thumbUp && indexUp && middleUp && !ringUp && !pinkyUp) {
            return { gesture: 'V', confidence: 0.9 };
        }
        
        // W - Three fingers up (index, middle, ring)
        if (!thumbUp && indexUp && middleUp && ringUp && !pinkyUp) {
            return { gesture: 'W', confidence: 0.9 };
        }
        
        // X - Index finger bent
        if (!thumbUp && indexUp && !middleUp && !ringUp && !pinkyUp) {
            return { gesture: 'X', confidence: 0.8 };
        }
        
        // Y - Thumb and pinky extended
        if (thumbUp && !indexUp && !middleUp && !ringUp && pinkyUp) {
            return { gesture: 'Y', confidence: 0.9 };
        }
        
        // Z - Index finger drawing Z in air
        if (!thumbUp && indexUp && !middleUp && !ringUp && !pinkyUp) {
            return { gesture: 'Z', confidence: 0.8 };
        }
        
        return null;
    }
    
    recognizeNumbers(fingerStates, landmarks) {
        const [thumbUp, indexUp, middleUp, ringUp, pinkyUp] = fingerStates;
        const upFingers = fingerStates.filter(state => state).length;
        
        // Strict 0-5 mapping to avoid misclassifying 2 as 7
        if (upFingers === 0) return { gesture: 'zero', confidence: 0.92 };
        if (upFingers === 1 && indexUp) return { gesture: 'one', confidence: 0.92 };
        if (upFingers === 2 && indexUp && middleUp && !thumbUp && !ringUp && !pinkyUp) return { gesture: 'two', confidence: 0.94 };
        if (upFingers === 3 && indexUp && middleUp && ringUp && !thumbUp && !pinkyUp) return { gesture: 'three', confidence: 0.92 };
        if (upFingers === 4 && indexUp && middleUp && ringUp && pinkyUp && !thumbUp) return { gesture: 'four', confidence: 0.92 };
        if (upFingers === 5) return { gesture: 'five', confidence: 0.92 };
        
        // Ten (thumbs up) only when other fingers are clearly down
        if (this.isThumbsUp(landmarks)) return { gesture: 'ten', confidence: 0.85 };
        
        return null;
    }
    
    recognizeCommonSigns(landmarks, fingerStates) {
        const [thumbUp, indexUp, middleUp, ringUp, pinkyUp] = fingerStates;
        const thumb = landmarks[4];
        const index = landmarks[8];
        
        // OK gesture
        if (this.isOKGesture(thumb, index)) {
            return { gesture: 'ok', confidence: 0.9 };
        }
        
        // Thumbs up/down
        if (thumbUp && !indexUp && !middleUp && !ringUp && !pinkyUp) {
            return { gesture: 'thumbs_up', confidence: 0.9 };
        }
        
        // Peace sign
        if (!thumbUp && indexUp && middleUp && !ringUp && !pinkyUp) {
            return { gesture: 'peace', confidence: 0.9 };
        }
        
        // Wave
        if (!thumbUp && indexUp && middleUp && ringUp && pinkyUp) {
            return { gesture: 'wave', confidence: 0.8 };
        }
        
        // Call me
        if (thumbUp && indexUp && middleUp && ringUp && !pinkyUp) {
            return { gesture: 'call_me', confidence: 0.8 };
        }
        
        // Pointing
        if (!thumbUp && indexUp && !middleUp && !ringUp && !pinkyUp) {
            return { gesture: 'pointing', confidence: 0.85 };
        }
        
        // Fist
        if (!thumbUp && !indexUp && !middleUp && !ringUp && !pinkyUp) {
            return { gesture: 'fist', confidence: 0.9 };
        }
        
        // Open palm
        if (thumbUp && indexUp && middleUp && ringUp && pinkyUp) {
            return { gesture: 'open_palm', confidence: 0.9 };
        }
        
        return null;
    }
    
    recognizeBasicGestures(fingerStates, landmarks) {
        const [thumbUp, indexUp, middleUp, ringUp, pinkyUp] = fingerStates;
        
        // Basic fallback gestures
        if (thumbUp && !indexUp && !middleUp && !ringUp && !pinkyUp) {
            return { gesture: 'thumbs_up', confidence: 0.8 };
        }
        
        if (!thumbUp && indexUp && middleUp && !ringUp && !pinkyUp) {
            return { gesture: 'peace', confidence: 0.8 };
        }
        
        if (!thumbUp && !indexUp && !middleUp && !ringUp && !pinkyUp) {
            return { gesture: 'fist', confidence: 0.8 };
        }
        
        return null;
    }
    
    // Helper methods for gesture recognition
    isFingerUp(fingerTip, fingerPip, wrist) {
        // Robust criteria: tip further from wrist than PIP and above PIP in image space
        const distTip = Math.hypot(fingerTip.x - wrist.x, fingerTip.y - wrist.y);
        const distPip = Math.hypot(fingerPip.x - wrist.x, fingerPip.y - wrist.y);
        if (distTip <= distPip * 1.05) return false;
        return fingerTip.y < fingerPip.y;
    }
    
    isOKGesture(thumb, index) {
        const distance = Math.sqrt(
            Math.pow(thumb.x - index.x, 2) + 
            Math.pow(thumb.y - index.y, 2)
        );
        return distance < 0.05;
    }
    
    isCurvedHand(landmarks) {
        // Check if fingers are curved like letter C
        const fingerTips = [landmarks[8], landmarks[12], landmarks[16], landmarks[20]];
        const fingerPips = [landmarks[6], landmarks[10], landmarks[14], landmarks[18]];
        
        let curvedCount = 0;
        for (let i = 0; i < fingerTips.length; i++) {
            if (fingerTips[i].y > fingerPips[i].y && fingerTips[i].y < fingerPips[i].y + 0.1) {
                curvedCount++;
            }
        }
        return curvedCount >= 3;
    }
    
    isCurvedDownHand(landmarks) {
        // Check if all fingers are curved down
        const fingerTips = [landmarks[8], landmarks[12], landmarks[16], landmarks[20]];
        const fingerPips = [landmarks[6], landmarks[10], landmarks[14], landmarks[18]];
        
        let curvedDownCount = 0;
        for (let i = 0; i < fingerTips.length; i++) {
            if (fingerTips[i].y > fingerPips[i].y) {
                curvedDownCount++;
            }
        }
        return curvedDownCount >= 3;
    }
    
    isFShape(landmarks) {
        // Check for F shape (thumb and index touching, others up)
        const thumb = landmarks[4];
        const index = landmarks[8];
        const middle = landmarks[12];
        const ring = landmarks[16];
        const pinky = landmarks[20];
        const wrist = landmarks[0];
        
        const thumbIndexDistance = Math.sqrt(
            Math.pow(thumb.x - index.x, 2) + 
            Math.pow(thumb.y - index.y, 2)
        );
        
        return thumbIndexDistance < 0.05 && 
               this.isFingerUp(middle, landmarks[10], wrist) &&
               this.isFingerUp(ring, landmarks[14], wrist) &&
               this.isFingerUp(pinky, landmarks[18], wrist);
    }
    
    isOCircle(landmarks) {
        // Check if fingers form a circle like letter O
        const fingerTips = [landmarks[8], landmarks[12], landmarks[16], landmarks[20]];
        const centerX = fingerTips.reduce((sum, tip) => sum + tip.x, 0) / fingerTips.length;
        const centerY = fingerTips.reduce((sum, tip) => sum + tip.y, 0) / fingerTips.length;
        
        let inCircleCount = 0;
        for (const tip of fingerTips) {
            const distance = Math.sqrt(
                Math.pow(tip.x - centerX, 2) + 
                Math.pow(tip.y - centerY, 2)
            );
            if (distance < 0.1) {
                inCircleCount++;
            }
        }
        return inCircleCount >= 3;
    }
    
    isThumbsUp(landmarks) {
        const thumb = landmarks[4];
        const index = landmarks[8];
        const middle = landmarks[12];
        const ring = landmarks[16];
        const pinky = landmarks[20];
        
        return this.isFingerUp(thumb, landmarks[3], landmarks[0]) &&
               !this.isFingerUp(index, landmarks[6], landmarks[0]) &&
               !this.isFingerUp(middle, landmarks[10], landmarks[0]) &&
               !this.isFingerUp(ring, landmarks[14], landmarks[0]) &&
               !this.isFingerUp(pinky, landmarks[18], landmarks[0]);
    }
    
    processGesture(gestureData) {
        const word = this.gestureMap[gestureData.gesture];
        
        if (word && gestureData.gesture !== this.currentGesture) {
            this.currentGesture = gestureData.gesture;
            this.currentWord.textContent = word;
            this.currentWord.classList.add('success-animation');
            
            // Add to history
            this.gestureHistory.push({
                gesture: gestureData.gesture,
                word: word,
                timestamp: Date.now()
            });
            
            // Update full text
            this.updateFullText();
            
            // Remove animation class after animation completes
            setTimeout(() => {
                this.currentWord.classList.remove('success-animation');
            }, 600);
        }
    }
    
    updateFullText() {
        const words = this.gestureHistory.map(item => item.word);
        let text = words.join(this.autoSpace ? ' ' : '');
        
        // Limit history to last 20 gestures
        if (this.gestureHistory.length > 20) {
            this.gestureHistory = this.gestureHistory.slice(-20);
        }
        
        this.fullText.textContent = text;
    }
    
    clearText() {
        this.gestureHistory = [];
        this.currentGesture = null;
        this.currentWord.textContent = 'No gesture detected';
        this.fullText.textContent = '';
    }
    
    updateStatus(message, type) {
        this.statusText.textContent = message;
        this.statusDot.className = `status-dot ${type}`;
    }
    
    // Utility functions for drawing
    drawConnectors(ctx, landmarks, connections, options) {
        for (const connection of connections) {
            const start = landmarks[connection[0]];
            const end = landmarks[connection[1]];
            
            ctx.beginPath();
            ctx.moveTo(start.x * ctx.canvas.width, start.y * ctx.canvas.height);
            ctx.lineTo(end.x * ctx.canvas.width, end.y * ctx.canvas.height);
            ctx.strokeStyle = options.color;
            ctx.lineWidth = options.lineWidth;
            ctx.stroke();
        }
    }
    
    drawLandmarks(ctx, landmarks, options) {
        for (const landmark of landmarks) {
            ctx.beginPath();
            ctx.arc(
                landmark.x * ctx.canvas.width,
                landmark.y * ctx.canvas.height,
                options.radius,
                0,
                2 * Math.PI
            );
            ctx.fillStyle = options.color;
            ctx.fill();
        }
    }

    // Path utilities
    resamplePath(path, numPoints) {
        // Ramer–Douglas–Peucker like uniform resampling based on cumulative length
        const total = this.getPathLengthFrom(path);
        if (total === 0) return path.slice();
        const step = total / (numPoints - 1);
        const newPts = [path[0]];
        let D = 0;
        for (let i = 1; i < path.length; i++) {
            const prev = path[i - 1];
            const curr = path[i];
            const d = Math.hypot(curr.x - prev.x, curr.y - prev.y);
            if ((D + d) >= step) {
                const qx = prev.x + ((step - D) / d) * (curr.x - prev.x);
                const qy = prev.y + ((step - D) / d) * (curr.y - prev.y);
                newPts.push({ x: qx, y: qy, timestamp: curr.timestamp });
                path.splice(i, 0, { x: qx, y: qy, timestamp: curr.timestamp });
                D = 0;
            } else {
                D += d;
            }
        }
        // Ensure exact length
        while (newPts.length < numPoints) newPts.push(path[path.length - 1]);
        return newPts;
    }

    getPathLengthFrom(path) {
        let length = 0;
        for (let i = 1; i < path.length; i++) {
            length += Math.hypot(path[i].x - path[i-1].x, path[i].y - path[i-1].y);
        }
        return length;
    }

    countInflections() {
        // Count sign changes in turning direction along the path
        if (this.writingPath.length < 5) return 0;
        let lastSign = 0;
        let changes = 0;
        for (let i = 2; i < this.writingPath.length; i++) {
            const a = this.writingPath[i - 2];
            const b = this.writingPath[i - 1];
            const c = this.writingPath[i];
            const v1x = b.x - a.x, v1y = b.y - a.y;
            const v2x = c.x - b.x, v2y = c.y - b.y;
            const cross = v1x * v2y - v1y * v2x; // z-component of 2D cross product
            const mag1 = Math.hypot(v1x, v1y);
            const mag2 = Math.hypot(v2x, v2y);
            if (mag1 < 1 || mag2 < 1) continue;
            const sign = (cross > 0 ? 1 : (cross < 0 ? -1 : 0));
            if (sign !== 0) {
                if (lastSign !== 0 && sign !== lastSign) changes++;
                lastSign = sign;
            }
        }
        return changes;
    }
}

// Hand connections for MediaPipe
const HAND_CONNECTIONS = [
    [0, 1], [1, 2], [2, 3], [3, 4], // thumb
    [0, 5], [5, 6], [6, 7], [7, 8], // index
    [0, 9], [9, 10], [10, 11], [11, 12], // middle
    [0, 13], [13, 14], [14, 15], [15, 16], // ring
    [0, 17], [17, 18], [18, 19], [19, 20], // pinky
    [0, 5], [5, 9], [9, 13], [13, 17] // palm
];

// Initialize the detector when the page loads
document.addEventListener('DOMContentLoaded', () => {
    new SignLanguageDetector();
});

// Add keyboard shortcuts
document.addEventListener('keydown', (e) => {
    if (e.key === ' ') {
        e.preventDefault();
        const detector = window.signDetector;
        if (detector) {
            detector.clearText();
        }
    }
});

// Handle page visibility changes
document.addEventListener('visibilitychange', () => {
    if (document.hidden) {
        // Page is hidden, could stop camera to save resources
        console.log('Page hidden');
    } else {
        // Page is visible again
        console.log('Page visible');
    }
}); 