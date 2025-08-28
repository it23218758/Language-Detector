# 🤟 Sign Language Detector

A comprehensive real-time web application that uses computer vision to detect hand gestures and convert them into text. Built with HTML5, CSS3, JavaScript, and MediaPipe for accurate hand gesture recognition. Now supports **200+ signs** including the complete ASL alphabet, numbers, and common phrases.

## ✨ Features

- **Complete ASL Alphabet Support**: Recognizes all 26 letters (A-Z)
- **Number Recognition**: Detects numbers 0-10 with special gestures
- **200+ Signs & Gestures**: Comprehensive sign language vocabulary
- **Finger Writing Detection**: Draw letters in the air with your index finger
- **Real-time Hand Gesture Recognition**: Uses MediaPipe Hands for accurate hand landmark detection
- **Live Camera Feed**: Real-time video processing with hand landmark visualization
- **Text Output**: Displays detected gestures as words with full text history
- **Customizable Settings**: Adjustable confidence threshold and auto-spacing options
- **Responsive Design**: Works on desktop, tablet, and mobile devices
- **Modern UI**: Beautiful gradient design with smooth animations

## 🎯 Supported Signs

### ASL Alphabet (A-Z)
- **A**: Fist with thumb on side
- **B**: All fingers extended, thumb tucked
- **C**: Curved hand like letter C
- **D**: Index finger pointing up, others closed
- **E**: All fingers curved down
- **F**: Thumb and index touching, other fingers up
- **G**: Index pointing, thumb extended
- **H**: Index and middle fingers extended, close together
- **I**: Pinky extended, others closed
- **J**: Pinky extended, moving in J motion
- **K**: Index and middle extended, spread apart
- **L**: Thumb and index forming L shape
- **M**: Three fingers down, thumb tucked
- **N**: Two fingers down, thumb tucked
- **O**: Fingers curved to form circle
- **P**: Index pointing down, thumb extended
- **Q**: Index pointing down, thumb extended
- **R**: Index and middle crossed
- **S**: Fist with thumb over fingers
- **T**: Index pointing up between middle and ring
- **U**: Index and middle fingers together, pointing up
- **V**: Index and middle fingers spread, pointing up
- **W**: Three fingers up (index, middle, ring)
- **X**: Index finger bent
- **Y**: Thumb and pinky extended
- **Z**: Index finger drawing Z in air

### Numbers (0-10)
- **0**: Fist
- **1**: One finger
- **2**: Two fingers
- **3**: Three fingers
- **4**: Four fingers
- **5**: Open palm
- **6**: Thumb + index
- **7**: Thumb + 2 fingers
- **8**: Thumb + 3 fingers
- **9**: Thumb + 4 fingers
- **10**: Thumbs up

### Common Words & Phrases
- **Hello, Goodbye, Thank you, Please**
- **Yes, No, Good, Bad, OK**
- **Help, Sorry, Excuse me, Understand**
- **Name, What, Where, When, Why, How, Who**
- **Family, Friend, Love, Like, Want, Need**
- **Eat, Drink, Sleep, Work, Play, Learn, Teach**
- **School, Home, Time, Today, Tomorrow, Yesterday**
- **Big, Small, Hot, Cold, Happy, Sad, Angry**

### Gestures & Actions
- **Thumbs Up/Down, Peace Sign, OK Gesture**
- **Wave, Call Me, Fist, Open Palm, Pointing**
- **Victory, Rock On, Clap, Shh**
- **Come Here, Go Away, Wait, Hurry**
- **Stop, Go, Look, Listen, Think**

### Colors
- **Red, Blue, Green, Yellow, Black, White**
- **Purple, Orange, Pink, Brown**

### Animals
- **Dog, Cat, Bird, Fish, Horse, Cow, Pig, Sheep, Chicken, Duck**

### Food & Drinks
- **Water, Milk, Coffee, Tea, Bread, Meat**
- **Vegetables, Fruit, Apple, Banana, Orange**
- **Pizza, Hamburger**

### Body Parts
- **Head, Face, Eye, Ear, Nose, Mouth**
- **Hand, Arm, Leg, Foot**

### Emotions & Feelings
- **Happy, Sad, Angry, Surprised, Scared**
- **Excited, Bored, Confused**

### Weather
- **Sunny, Rainy, Snowy, Cloudy**
- **Hot, Cold, Warm, Cool**

### Time & Calendar
- **Days of the week (Monday-Sunday)**
- **Months (January-December)**

### Finger Writing Detection
- **Air Writing**: Draw letters in the air with your index finger
- **Supported Letters**: A, C, E, F, H, I, L, M, N, O, S, U, V, W, X, Z
- **Writing Mode**: Extend only your index finger to activate writing mode
- **Real-time Drawing**: See your finger path drawn on screen
- **Automatic Recognition**: Letters are recognized after you finish drawing
- **Path Analysis**: Advanced algorithms analyze drawing patterns and shapes

## 🚀 How to Use

1. **Open the Website**: Open `index.html` in a modern web browser (Chrome, Firefox, Safari, Edge)

2. **Grant Camera Permission**: Click "Start Camera" and allow camera access when prompted

3. **Show Hand Signs**: Position your hand in the camera view and make signs:
   - Hold your hand steady for better detection
   - Ensure good lighting for optimal recognition
   - Keep your hand within the camera frame
   - Hold signs for 1-2 seconds for recognition
   - **For Finger Writing**: Extend only your index finger and draw letters in the air

4. **View Results**: 
   - Current sign appears in large text
   - Full text history shows below
   - Use "Clear Text" to reset the output

5. **Adjust Settings**:
   - **Confidence Slider**: Increase for more accurate detection, decrease for more sensitive detection
   - **Auto-space**: Toggle automatic spacing between words

## 🛠️ Technical Details

### Technologies Used
- **Frontend**: HTML5, CSS3, JavaScript (ES6+)
- **Computer Vision**: MediaPipe Hands API
- **Camera Access**: WebRTC getUserMedia API
- **Canvas API**: For real-time video processing and drawing

### Architecture
- **SignLanguageDetector Class**: Main application logic
- **MediaPipe Integration**: Hand landmark detection and processing
- **Advanced Gesture Classification**: Multi-layered recognition system
- **Real-time Processing**: Continuous video frame analysis

### Gesture Recognition Algorithm
The application uses a sophisticated multi-layered approach:
1. **ASL Alphabet Recognition**: Specialized detection for all 26 letters
2. **Number Recognition**: Finger counting and special number gestures
3. **Common Signs Recognition**: Everyday words and phrases
4. **Basic Gestures**: Fallback for simple hand positions
5. **Finger Writing Detection**: Path analysis for letters drawn in air
6. **Finger State Analysis**: Determines which fingers are extended
7. **Landmark Analysis**: Analyzes 21 hand landmarks from MediaPipe
8. **Pattern Matching**: Matches finger configurations to known signs
9. **Confidence Scoring**: Assigns confidence levels to detected signs

### Recognition Categories
| Category | Signs | Detection Method |
|----------|-------|------------------|
| ASL Alphabet | 26 letters | Specialized finger patterns |
| Numbers | 0-10 | Finger counting + special gestures |
| Common Words | 100+ words | Complex hand configurations |
| Gestures | 50+ gestures | Basic finger state analysis |
| Colors | 10 colors | Hand shapes and positions |
| Animals | 10 animals | Specific hand formations |
| Food & Drinks | 15 items | Hand gestures and shapes |
| Finger Writing | 16 letters | Path analysis and shape recognition |

## 📱 Browser Compatibility

- ✅ Chrome 88+
- ✅ Firefox 85+
- ✅ Safari 14+
- ✅ Edge 88+

**Note**: Requires HTTPS or localhost for camera access in most browsers.

## 🔧 Installation & Setup

1. **Clone or Download**: Get the project files
2. **No Build Required**: This is a pure frontend application
3. **Open in Browser**: Simply open `index.html` in a web browser
4. **Camera Access**: Grant camera permissions when prompted

## 🎯 Use Cases

- **Accessibility**: Help people with speech difficulties communicate
- **Education**: Teach sign language in interactive ways
- **Communication**: Silent communication in noisy environments
- **Entertainment**: Fun gesture-based games and applications
- **Research**: Computer vision and gesture recognition studies
- **Language Learning**: Learn ASL alphabet and basic signs
- **Assistive Technology**: Support for hearing-impaired individuals

## 🔮 Future Enhancements

- [ ] American Sign Language (ASL) sentence formation
- [ ] Voice output for detected signs
- [ ] Custom sign training and recognition
- [ ] Multi-hand support for complex signs
- [ ] Sign recording and playback
- [ ] Mobile app version with native camera access
- [ ] Offline support with local processing
- [ ] Sign language translation between different systems
- [ ] Real-time conversation mode
- [ ] Educational games and quizzes

## 🤝 Contributing

Feel free to contribute to this project by:
- Reporting bugs and issues
- Suggesting new signs and features
- Adding more gesture support
- Improving the UI/UX
- Optimizing performance
- Adding new sign language systems

## 📄 License

This project is open source and available under the MIT License.

## 🙏 Acknowledgments

- **MediaPipe**: For the excellent hand tracking API
- **Google**: For developing MediaPipe
- **WebRTC**: For camera access capabilities
- **ASL Community**: For sign language guidance
- **Open Source Community**: For various tools and libraries

## 📞 Support

If you encounter any issues or have questions:
1. Check browser compatibility
2. Ensure camera permissions are granted
3. Try refreshing the page
4. Check console for error messages
5. Adjust confidence slider for better detection
6. Ensure good lighting conditions

---

**Made with ❤️ for the sign language community**

*Now supporting 200+ signs for comprehensive communication!* 