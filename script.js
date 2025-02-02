$(function () {
    let totalQuestions = 0;

    $("#quizBox").hide();
    $("#fixedProgress").hide();
    
    $("#btnStart").click(function () {
      $("#startBox").fadeOut(300, function() {
        $("#quizBox").fadeIn(300);
        $("#fixedProgress").slideDown(300);
        loadQuiz();
      });
    });

    function loadQuiz() {
      $.getJSON("quiz.json", function (data) {
        totalQuestions = data.length;
        let quizListHtml = "";

        $.each(data, function (index, quiz) {
          let no = index + 1;
          quizListHtml += `
            <div class="card mb-4" id="question${no}">
              <div class="card-body">
                <h5 class="card-title">Question ${no}</h5>
                <p class="card-text">${quiz.title}</p>
                <div class="options-container">`;
          $.each(quiz.options, function (optionIndex, option) {
            quizListHtml += `
              <div class="form-check">
                <input class="form-check-input quiz-option" type="radio" name="q${no}" value="${optionIndex + 1}" id="q${no}opt${optionIndex + 1}">
                <label class="form-check-label" for="q${no}opt${optionIndex + 1}">${option}</label>
              </div>`;
          });
          quizListHtml += "</div></div></div>";
        });

        $("#quizListBox").html(quizListHtml);

        $(".quiz-option").change(function () {
          checkAllAnswered();
        });
      });
    }

    function checkAllAnswered() {
      let answered = 0;
      for (let i = 1; i <= totalQuestions; i++) {
        if ($(`input[name='q${i}']:checked`).length > 0) {
          answered++;
        }
      }

      let progress = Math.round((answered / totalQuestions) * 100);
      $("#progressBar").css("width", `${progress}%`).text(`${progress}%`);

      if (answered === totalQuestions) {
        $("#btnCheckAnswer").prop("disabled", false);
      }
    }

    $("#btnCheckAnswer").click(function () {
      $(this).prop('disabled', true);
      $('.quiz-option').prop('disabled', true);
      
      $.getJSON("quiz.json", function (data) {
        let score = 0;

        $.each(data, function (index, quiz) {
          let no = index + 1;
          let selectedAnswer = $(`input[name='q${no}']:checked`).val();
          let correctAnswer = quiz.answer;

          if (parseInt(selectedAnswer) === correctAnswer) {
            score++;
            $(`#question${no}`).addClass("correct");
          } else {
            $(`#question${no}`).addClass("incorrect");
          }

          $(`input[name='q${no}'][value='${correctAnswer}']`)
            .parent()
            .addClass("text-success");
          if (selectedAnswer && parseInt(selectedAnswer) !== correctAnswer) {
            $(`input[name='q${no}'][value='${selectedAnswer}']`)
              .parent()
              .addClass("text-danger");
          }
        });

        $("#resultBox").html(
          `<div class="result-box">
            Your Score: ${score}/${totalQuestions}
            <div class="mt-3">
              <button class="btn btn-primary" onclick="location.reload()">Try Again</button>
            </div>
          </div>`
        );
        
        $('html, body').animate({
          scrollTop: $("#resultBox").offset().top - 100
        }, 1000);
      });
    });
  });
