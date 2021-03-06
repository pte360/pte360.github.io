const loadContent = (loadQuestion, showResult, hideResult, qArray, visited, localStorageVariableName) => {
    //Get data
    var jsonURL = "data.json";
    var questionIndex = 0;
    // var visited;
    var searchKeys = [];
    //get visited quize items
    if (localStorage.getItem(localStorageVariableName)) {
        visited = JSON.parse(localStorage.getItem(localStorageVariableName))
    }

    var sortByPro = $("#sort_by").children("option:selected").val();
    //Consruct the select  menu
    $.getJSON(jsonURL, function (data) {
        qArray = data;
        buildQuizzSelect(data, visited, localStorageVariableName);

        $("#search").click(function (event) {
            qArray = data;
            var searchKeyword = $("#searchKeywords").val();
            var sortByPro = $("#sort_by").children("option:selected").val();
           
            if (searchKeyword.length != 0) {
                qArray = findout(qArray, "content", searchKeyword, sortByPro);
            }
            //alert("Array length = " + qArray.length + " , Sort By = " + sortByPro);
            if(qArray.length<1){
                alert("No search result found for "+searchKeyword);
            }else{
                buildQuizzSelect(qArray, visited, localStorageVariableName);
            }         
    
        });

        $("#reset").click(function (event) {
            qArray = data;
            $("#searchKeywords").val("");
            $("#sort_by").val($("#sort_by option:first").val());
            $("#sort_type").val($("#sort_type option:first").val());

            buildQuizzSelect(qArray, visited, localStorageVariableName);
        });

    });

    // SHOW SELECTED VALUE.
    $('#samples').change(function () {
        questionIndex = this.options[this.selectedIndex].index;
        loadQuestion(qArray, questionIndex, localStorageVariableName);
        //If result shown swap 
        if ($('#result:visible').length) { $('#show_answer').trigger('click'); }    
    });

    $("#next").click(function () {
        var nextElement = $('#samples > option:selected').next('option');
        if (nextElement.length > 0) {
            $('#samples > option:selected').removeAttr('selected').next('option').attr('selected', 'selected');
            $('#samples').trigger('change');
        }
    });

    $("#prev").click(function () {
        var nextElement = $('#samples > option:selected').prev('option');
        if (nextElement.length > 0) {
            $('#samples > option:selected').removeAttr('selected').prev('option').attr('selected', 'selected');
            $('#samples').trigger('change');
        }
    });

    // SHOW ANSWERS 
    $("#show_answer").click(function (event) {
        var id = qArray[questionIndex].id;
        //visited 
        item_visited(id, visited, localStorageVariableName);
        if ($('#result:visible').length) {

            hideResult(qArray, questionIndex);
            //reset
            $("#result").hide();
            $('#show_answer').text('SHOW ANSWERS');

        } else {

            showResult(qArray, questionIndex);
            //reset
            $('#show_answer').text('HIDE ANSWERS');
            $("#result").show();
        }
    });


 

   
    return 1;
}

function buildQuizzSelect(data, visited, localStorageVariableName) {

    $('#samples').html("");
    data.sort(orderBy);

    $.each(data, function (index, value) {
        // APPEND OR INSERT DATA TO SELECT ELEMENT.	
        //alert(value["id"]);		
        var optionClass = "";
        if (visited.includes(value.id)) optionClass = "visited";
        $('#samples').append('<option value="' + value.id  + '" class="' + optionClass + '">[' + value.id + ' - (R:'+value.rating+')] </option>');
    });

    // Initialize Quetion area into question index zero 
    questionIndex = 0;
    loadQuestion(data, questionIndex, localStorageVariableName);

}


function item_visited(id, visited, visitedQuiz) {
    if (!visited.includes(id)) {
        visited.push(id);
        visited.sort();
        localStorage.setItem(visitedQuiz, JSON.stringify(visited))
        //refresh style for visited options 

        $(".visited").css({ 'margin': '40px', 'background-color': 'rgb(225, 0, 255)', 'color': '#fff', 'text-shadow': '0 1px 0 rgba(0, 0, 0, 0.4)' });

    }
}

function findout(objArray, key, value, sortByPro) {
    var foundArray = [];
    var searchKeywordSplit = value.trim().split(/\s+/);
    var searchKeyword = searchKeywordSplit.join("|");
    var regex = new RegExp(searchKeyword, "i");

    $.each(objArray, function (index, item) {
        if (regex.test(item[key])) foundArray.push(item);
    });

    foundArray = foundArray.sort(orderBy);

    return foundArray;
}

//sort by id or rating

function orderBy(a, b) {
    var prop = $("#sort_by").children("option:selected").val();
    var sort_type = $("#sort_type").children("option:selected").val();
    if(sort_type=="asc")  return a[prop]-b[prop];
    else return b[prop]-a[prop];
}
