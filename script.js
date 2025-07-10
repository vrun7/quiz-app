let questions = [];
        let currentQuestion = 0;
        let score = 0;
        let selectedAnswer = null;
        let timeLeft = 30;
        let timer;
        let userAnswers = [];
        let selectedCategory = null;
        let selectedDifficulty = null;
        let selectedSubjectName = '';

        function selectSection(element, subjectName) {
            // Remove selected class from all sections
            document.querySelectorAll('.section-card').forEach(card => {
                card.classList.remove('selected');
            });
            
            // Add selected class to clicked section
            element.classList.add('selected');
            selectedCategory = element.dataset.category;
            selectedSubjectName = subjectName;
            
            checkStartButton();
        }

        function selectDifficulty(element) {
            // Remove selected class from all difficulties
            document.querySelectorAll('.difficulty-option').forEach(option => {
                option.classList.remove('selected');
            });
            
            // Add selected class to clicked difficulty
            element.classList.add('selected');
            selectedDifficulty = element.dataset.difficulty;
            
            checkStartButton();
        }

        function checkStartButton() {
            const startBtn = document.getElementById('startBtn');
            if (selectedCategory && selectedDifficulty) {
                startBtn.classList.add('active');
            } else {
                startBtn.classList.remove('active');
            }
        }

        async function fetchQuestions() {
            try {
                // Use QuizAPI - simple and free API
                const apiUrl = `https://quizapi.io/api/v1/questions?apiKey=YOUR_API_KEY&limit=10&category=${selectedCategory}&difficulty=${selectedDifficulty}`;
                
                // Since we can't use real API keys in this demo, we'll use a fallback approach
                // Try to fetch from a simple quiz API or use local questions
                
                let response;
                try {
                    // Try the simple quiz API first
                    response = await fetch(`https://the-trivia-api.com/api/questions?categories=${getCategoryName()}&limit=10&difficulty=${selectedDifficulty}`);
                    if (!response.ok) throw new Error('API not available');
                    
                    const data = await response.json();
                    return data.map(q => {
                        const allOptions = shuffleArray([...q.incorrectAnswers, q.correctAnswer]);
                        return {
                            question: q.question,
                            options: allOptions,
                            correct: allOptions.indexOf(q.correctAnswer)
                        };
                    });
                } catch (apiError) {
                    // Fallback to local questions if API fails
                    console.log('Using fallback questions');
                    return getLocalQuestions();
                }
            } catch (error) {
                // Use local questions as final fallback
                return getLocalQuestions();
            }
        }

        function getCategoryName() {
            switch(selectedCategory) {
                case '9': return 'science';
                case '19': return 'mathematics';
                case '10': return 'arts_and_literature';
                default: return 'science';
            }
        }

        function getLocalQuestions() {
            const questionSets = {
                '9': { // Science
                    easy: [
                        { question: "What is the chemical symbol for water?", options: ["H2O", "CO2", "O2", "NaCl"], correct: 0 },
                        { question: "What planet is known as the Red Planet?", options: ["Venus", "Mars", "Jupiter", "Saturn"], correct: 1 },
                        { question: "How many bones are in the human body?", options: ["206", "208", "210", "212"], correct: 0 },
                        { question: "What gas do plants absorb from the atmosphere?", options: ["Oxygen", "Nitrogen", "Carbon Dioxide", "Hydrogen"], correct: 2 },
                        { question: "What is the speed of light?", options: ["300,000 km/s", "150,000 km/s", "450,000 km/s", "600,000 km/s"], correct: 0 }
                    ],
                    medium: [
                        { question: "What is the chemical symbol for Gold?", options: ["Go", "Gd", "Au", "Ag"], correct: 2 },
                        { question: "Which organ produces insulin?", options: ["Liver", "Kidney", "Pancreas", "Heart"], correct: 2 },
                        { question: "What is the hardest natural substance?", options: ["Gold", "Iron", "Diamond", "Platinum"], correct: 2 },
                        { question: "What type of animal is a Komodo dragon?", options: ["Snake", "Lizard", "Crocodile", "Turtle"], correct: 1 },
                        { question: "What is the study of earthquakes called?", options: ["Geology", "Seismology", "Meteorology", "Astronomy"], correct: 1 }
                    ],
                    hard: [
                        { question: "What is the most abundant gas in Earth's atmosphere?", options: ["Oxygen", "Carbon Dioxide", "Nitrogen", "Argon"], correct: 2 },
                        { question: "What is the pH of pure water?", options: ["6", "7", "8", "9"], correct: 1 },
                        { question: "Which scientist developed the theory of relativity?", options: ["Newton", "Einstein", "Hawking", "Curie"], correct: 1 },
                        { question: "What is the powerhouse of the cell?", options: ["Nucleus", "Ribosome", "Mitochondria", "Cytoplasm"], correct: 2 },
                        { question: "What is the atomic number of Carbon?", options: ["4", "6", "8", "12"], correct: 1 }
                    ]
                },
                '19': { // Mathematics
                    easy: [
                        { question: "What is 15 + 25?", options: ["30", "35", "40", "45"], correct: 2 },
                        { question: "What is 8 × 7?", options: ["54", "56", "58", "60"], correct: 1 },
                        { question: "What is 100 ÷ 4?", options: ["20", "25", "30", "35"], correct: 1 },
                        { question: "What is the square root of 64?", options: ["6", "7", "8", "9"], correct: 2 },
                        { question: "What is 2³?", options: ["6", "8", "9", "12"], correct: 1 }
                    ],
                    medium: [
                        { question: "What is the area of a circle with radius 5?", options: ["25π", "10π", "15π", "20π"], correct: 0 },
                        { question: "What is 12! ÷ 10!?", options: ["132", "120", "144", "110"], correct: 0 },
                        { question: "What is the derivative of x²?", options: ["x", "2x", "x²", "2x²"], correct: 1 },
                        { question: "What is sin(90°)?", options: ["0", "1", "0.5", "-1"], correct: 1 },
                        { question: "What is the sum of angles in a triangle?", options: ["90°", "180°", "270°", "360°"], correct: 1 }
                    ],
                    hard: [
                        { question: "What is the integral of 1/x?", options: ["x", "ln(x)", "1/x²", "x²"], correct: 1 },
                        { question: "What is e^(iπ) + 1?", options: ["0", "1", "i", "-1"], correct: 0 },
                        { question: "What is the limit of (1+1/n)^n as n→∞?", options: ["1", "2", "e", "π"], correct: 2 },
                        { question: "What is the determinant of a 2×2 identity matrix?", options: ["0", "1", "2", "4"], correct: 1 },
                        { question: "What is the Fibonacci sequence's golden ratio?", options: ["1.414", "1.618", "1.732", "2.718"], correct: 1 }
                    ]
                },
                '10': { // Literature
                    easy: [
                        { question: "Who wrote 'Romeo and Juliet'?", options: ["Charles Dickens", "William Shakespeare", "Mark Twain", "Jane Austen"], correct: 1 },
                        { question: "What is the first book in the Harry Potter series?", options: ["Chamber of Secrets", "Prisoner of Azkaban", "Philosopher's Stone", "Goblet of Fire"], correct: 2 },
                        { question: "Who wrote '1984'?", options: ["George Orwell", "Aldous Huxley", "Ray Bradbury", "Kurt Vonnegut"], correct: 0 },
                        { question: "What is the first line of 'A Tale of Two Cities'?", options: ["Call me Ishmael", "It was the best of times", "Happy families", "In the beginning"], correct: 1 },
                        { question: "Who created Sherlock Holmes?", options: ["Agatha Christie", "Edgar Allan Poe", "Arthur Conan Doyle", "Raymond Chandler"], correct: 2 }
                    ],
                    medium: [
                        { question: "Who wrote 'To Kill a Mockingbird'?", options: ["Harper Lee", "Toni Morrison", "Maya Angelou", "Zora Neale Hurston"], correct: 0 },
                        { question: "What is the last book in the Chronicles of Narnia series?", options: ["The Lion, the Witch and the Wardrobe", "The Last Battle", "The Magician's Nephew", "The Horse and His Boy"], correct: 1 },
                        { question: "Who wrote 'The Great Gatsby'?", options: ["Ernest Hemingway", "F. Scott Fitzgerald", "John Steinbeck", "William Faulkner"], correct: 1 },
                        { question: "What is the opening line of 'Pride and Prejudice'?", options: ["It is a truth universally acknowledged", "Call me Ishmael", "Happy families are all alike", "It was the best of times"], correct: 0 },
                        { question: "Who wrote 'One Hundred Years of Solitude'?", options: ["Jorge Luis Borges", "Gabriel García Márquez", "Mario Vargas Llosa", "Octavio Paz"], correct: 1 }
                    ],
                    hard: [
                        { question: "Who wrote 'Ulysses'?", options: ["James Joyce", "Virginia Woolf", "T.S. Eliot", "Ezra Pound"], correct: 0 },
                        { question: "What is the narrative technique used in 'The Sound and the Fury'?", options: ["Third person omniscient", "Stream of consciousness", "Epistolary", "Frame narrative"], correct: 1 },
                        { question: "Who wrote 'Beloved'?", options: ["Alice Walker", "Toni Morrison", "Maya Angelou", "Zora Neale Hurston"], correct: 1 },
                        { question: "What is the first book in Proust's 'In Search of Lost Time'?", options: ["Swann's Way", "In the Shadow of Young Girls in Flower", "The Guermantes Way", "Sodom and Gomorrah"], correct: 0 },
                        { question: "Who wrote 'The Waste Land'?", options: ["W.B. Yeats", "T.S. Eliot", "Robert Frost", "Wallace Stevens"], correct: 1 }
                    ]
                }
            };

            const categoryQuestions = questionSets[selectedCategory] || questionSets['9'];
            const difficultyQuestions = categoryQuestions[selectedDifficulty] || categoryQuestions['medium'];
            
            // Add more questions to reach 10 if needed
            const questions = [...difficultyQuestions];
            while (questions.length < 10) {
                questions.push(...difficultyQuestions);
            }
            
            return questions.slice(0, 10);
        }

        function decodeHTML(html) {
            const txt = document.createElement('textarea');
            txt.innerHTML = html;
            return txt.value;
        }

        function shuffleArray(array) {
            for (let i = array.length - 1; i > 0; i--) {
                const j = Math.floor(Math.random() * (i + 1));
                [array[i], array[j]] = [array[j], array[i]];
            }
            return array;
        }

        async function startQuiz() {
            if (!selectedCategory || !selectedDifficulty) {
                showError('Please select both a subject and difficulty level');
                return;
            }

            hideError();
            document.getElementById('startScreen').style.display = 'none';
            document.getElementById('loadingScreen').style.display = 'block';

            try {
                questions = await fetchQuestions();
                
                document.getElementById('loadingScreen').style.display = 'none';
                document.getElementById('quizContent').style.display = 'block';
                document.getElementById('currentSection').textContent = selectedSubjectName;
                
                currentQuestion = 0;
                score = 0;
                userAnswers = [];
                showQuestion();
                startTimer();
            } catch (error) {
                document.getElementById('loadingScreen').style.display = 'none';
                document.getElementById('startScreen').style.display = 'block';
                showError(error.message || 'Failed to load questions. Please try again.');
            }
        }

        function showError(message) {
            const errorDiv = document.getElementById('errorMessage');
            errorDiv.textContent = message;
            errorDiv.style.display = 'block';
        }

        function hideError() {
            document.getElementById('errorMessage').style.display = 'none';
        }

        function showQuestion() {
            const question = questions[currentQuestion];
            document.getElementById('question').textContent = question.question;
            document.getElementById('questionCounter').textContent = `Question ${currentQuestion + 1} of ${questions.length}`;
            
            const progressPercent = ((currentQuestion + 1) / questions.length) * 100;
            document.getElementById('progressBar').style.width = progressPercent + '%';
            
            const optionsContainer = document.getElementById('options');
            optionsContainer.innerHTML = '';
            
            question.options.forEach((option, index) => {
                const optionElement = document.createElement('div');
                optionElement.className = 'option';
                optionElement.textContent = option;
                optionElement.onclick = () => selectAnswer(index);
                optionsContainer.appendChild(optionElement);
            });
            
            selectedAnswer = null;
            document.getElementById('nextButton').classList.remove('active');
            resetTimer();
        }

        function selectAnswer(answerIndex) {
            selectedAnswer = answerIndex;
            const options = document.querySelectorAll('.option');
            options.forEach((option, index) => {
                option.classList.remove('selected');
                if (index === answerIndex) {
                    option.classList.add('selected');
                }
            });
            document.getElementById('nextButton').classList.add('active');
        }

        function nextQuestion() {
            if (selectedAnswer === null) return;
            
            clearInterval(timer);
            
            const question = questions[currentQuestion];
            const options = document.querySelectorAll('.option');
            
            userAnswers.push(selectedAnswer);
            
            // Show correct/incorrect answers
            options.forEach((option, index) => {
                if (index === question.correct) {
                    option.classList.add('correct');
                } else if (index === selectedAnswer && selectedAnswer !== question.correct) {
                    option.classList.add('incorrect');
                }
            });
            
            if (selectedAnswer === question.correct) {
                score++;
            }
            
            setTimeout(() => {
                currentQuestion++;
                if (currentQuestion < questions.length) {
                    showQuestion();
                    startTimer();
                } else {
                    showResults();
                }
            }, 1500);
        }

        function startTimer() {
            timeLeft = 30;
            updateTimerDisplay();
            timer = setInterval(() => {
                timeLeft--;
                updateTimerDisplay();
                if (timeLeft <= 0) {
                    clearInterval(timer);
                    if (selectedAnswer === null) {
                        selectedAnswer = -1;
                    }
                    nextQuestion();
                }
            }, 1000);
        }

        function resetTimer() {
            clearInterval(timer);
            timeLeft = 30;
            updateTimerDisplay();
        }

        function updateTimerDisplay() {
            document.getElementById('timeLeft').textContent = timeLeft + 's';
        }

        function showResults() {
            document.getElementById('quizContent').style.display = 'none';
            document.getElementById('resultsScreen').style.display = 'block';
            
            const percentage = Math.round((score / questions.length) * 100);
            
            document.getElementById('finalScore').textContent = `${score}/${questions.length}`;
            document.getElementById('resultSubject').textContent = selectedSubjectName;
            document.getElementById('resultDifficulty').textContent = selectedDifficulty.charAt(0).toUpperCase() + selectedDifficulty.slice(1);
            document.getElementById('correctCount').textContent = score;
            document.getElementById('incorrectCount').textContent = questions.length - score;
            document.getElementById('accuracy').textContent = percentage + '%';
            
            let message = '';
            if (percentage >= 90) {
                message = '🎉 Excellent! You\'re a quiz master!';
            } else if (percentage >= 70) {
                message = '👏 Great job! Well done!';
            } else if (percentage >= 50) {
                message = '👍 Good effort! Keep practicing!';
            } else {
                message = '📚 Keep studying and try again!';
            }
            
            document.getElementById('scoreMessage').textContent = message;
        }

        function restartQuiz() {
            document.getElementById('resultsScreen').style.display = 'none';
            document.getElementById('loadingScreen').style.display = 'block';
            startQuiz();
        }

        function changeSubject() {
            document.getElementById('resultsScreen').style.display = 'none';
            document.getElementById('startScreen').style.display = 'block';
            clearInterval(timer);
            
            // Reset selections
            document.querySelectorAll('.section-card').forEach(card => {
                card.classList.remove('selected');
            });
            document.querySelectorAll('.difficulty-option').forEach(option => {
                option.classList.remove('selected');
            });
            
            selectedCategory = null;
            selectedDifficulty = null;
            selectedSubjectName = '';
            checkStartButton();
        }