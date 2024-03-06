document.addEventListener("DOMContentLoaded", function() {
    if (window.location.pathname.includes("index.html") || window.location.pathname === "/") {
        const bioForm = document.getElementById("bio-form");
        if (bioForm) {
            bioForm.addEventListener("submit", function(event) {
                event.preventDefault();
                saveBioData();
            });
        }
    }
    if (window.location.pathname.includes("survey.html")) {
        const surveyForm = document.getElementById("survey");
        generateSurveyQuestions(surveyForm);
        document.getElementById("submitSurvey").addEventListener("click", function(event) {
            event.preventDefault(); 
            submitSurveyAnswers();
        });
    }
    if (window.location.pathname.includes("result.html")) {
        displayResults();
    }
});

function saveBioData() {
    var fullname = document.getElementById("fullname").value;
    var birthdate = document.getElementById("birthdate").value;
    var idnumber = document.getElementById("idnumber").value;
    var address = document.getElementById("address").value;

    localStorage.setItem("fullname", fullname);
    localStorage.setItem("birthdate", birthdate);
    localStorage.setItem("idnumber", idnumber);
    localStorage.setItem("address", address);

    window.location.href = 'https://github.com/linhtran6065/web-th1/survey.html';
}

function generateSurveyQuestions(form) {
    for (let i = 1; i <= 40; i++) {
        let questionType = determineQuestionType(i); 
        let questionHtml = ''; 
        
        switch(questionType) {
            case 'trueFalse':
                questionHtml = `<div class="question-container"><label>Câu ${i}: Đúng/Sai?</label><br>
                                <input type="radio" name="question${i}" value="true"> Đúng<br>
                                <input type="radio" name="question${i}" value="false"> Sai</div>`;
                break;
            case 'singleChoice':
                questionHtml = `<div class="question-container"><label>Câu ${i}: Chọn 1 trong 4 đáp án</label><br>
                                <input type="radio" name="question${i}" value="A"> A<br>
                                <input type="radio" name="question${i}" value="B"> B<br>
                                <input type="radio" name="question${i}" value="C"> C<br>
                                <input type="radio" name="question${i}" value="D"> D</div>`;
                break;
            case 'multipleChoice':
                questionHtml = `<div class="question-container"><label>Câu ${i}: Chọn nhiều đáp án</label><br>
                                <input type="checkbox" name="question${i}" value="A"> A<br>
                                <input type="checkbox" name="question${i}" value="B"> B<br>
                                <input type="checkbox" name="question${i}" value="C"> C<br>
                                <input type="checkbox" name="question${i}" value="D"> D</div>`;
                break;
            case 'text':
                questionHtml = `<div class="question-container"><label for="question${i}">Câu ${i}: Trả lời tự luận</label><br>
                                <textarea id="question${i}" name="question${i}"></textarea></div>`;
                break;
        }
        
        form.innerHTML += questionHtml;
    }
}

function determineQuestionType(questionNumber) {
    if (questionNumber <= 10) return 'trueFalse';
    else if (questionNumber <= 20) return 'singleChoice';
    else if (questionNumber <= 30) return 'multipleChoice';
    else return 'text';
}

function submitSurveyAnswers() {
    const answers = [];
    for (let i = 1; i <= 40; i++) {
        const questionType = determineQuestionType(i);
        let answer;

        if (questionType === 'text') {
            answer = document.getElementById(`question${i}`).value;
        } else {
            const inputs = document.querySelectorAll(`input[name="question${i}"]:checked`);
            if (inputs.length > 1) { // Đối với câu hỏi chọn nhiều đáp án
                answer = Array.from(inputs).map(input => input.value);
            } else if (inputs.length === 1) { // Đối với câu hỏi chọn một hoặc đúng/sai
                answer = inputs[0].value;
            }
        }

        answers.push({ question: i, answer: answer });
    }

    // Lưu câu trả lời vào localStorage
    localStorage.setItem('surveyAnswers', JSON.stringify(answers));

    // Chuyển hướng đến trang kết quả
    window.location.href = 'result.html';
}

function saveSurveyData() {
    localStorage.setItem("surveyCompleted", true);
    window.location.href = 'result.html';
}

function displayResults() {
    const answers = JSON.parse(localStorage.getItem('surveyAnswers'));

    if (answers) {
        const resultElement = document.getElementById('result');
        resultElement.innerHTML = '<h2>Kết quả khảo sát</h2>';

        answers.forEach((item, index) => {
            // Tạo container cho mỗi câu hỏi và câu trả lời
            const questionContainer = document.createElement('div');
            questionContainer.classList.add('question-container');
            
            // Tạo nội dung cho câu hỏi, bạn cần điều chỉnh để hiển thị câu hỏi thực tế từ dữ liệu của bạn
            const questionTitle = document.createElement('h3');
            questionTitle.innerHTML = `Câu ${index + 1}`;
            questionContainer.appendChild(questionTitle);

            // Hiển thị câu trả lời của người dùng
            const userAnswer = document.createElement('p');
            let answerText = Array.isArray(item.answer) ? item.answer.join(', ') : item.answer;
            userAnswer.innerHTML = `Đáp án của bạn: ${answerText}`;
            questionContainer.appendChild(userAnswer);

            // Thêm container câu hỏi vào phần tử kết quả
            resultElement.appendChild(questionContainer);
        });
    } else {
        document.body.innerHTML = "<p>Không tìm thấy kết quả khảo sát.</p>";
    }
}
