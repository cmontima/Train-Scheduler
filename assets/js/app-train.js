$(document).ready(function () {

    var config = {
        apiKey: "AIzaSyDiTeZ2rxyl_dzDJ9ML3cU6YY8e5NPR0fw",
        authDomain: "train-time-70f30.firebaseapp.com",
        databaseURL: "https://train-time-70f30.firebaseio.com",
        projectId: "train-time-70f30",
        storageBucket: "train-time-70f30.appspot.com",
        messagingSenderId: "78174011667"
    };
    firebase.initializeApp(config);

    //Create a variable to reference the database
    var database = firebase.database();
    var trainName = "";
    var destination = "";
    var firstTrainTime = 0;
    var frequency = "";

    $("#submitId").on("click", function (event) {
        event.preventDefault(); //Prevents page from refreshing

        trainName = $("#trainName-input").val().trim();
        destination = $("#destination-input").val().trim();
        firstTrainTime = $("#firstTrain-input").val().trim();
        frequency = $("#frequency-input").val().trim();

        database.ref().push({
            trainName: trainName,
            destination: destination,
            firstTrainTime: firstTrainTime,
            frequency: frequency,
        });
    });

    database.ref().on("child_added", function (snapshotChild) {

        console.log(snapshotChild.val());
        console.log(snapshotChild.val().trainName);
        console.log(snapshotChild.val().destination);
        console.log(snapshotChild.val().firstTrainTime);
        console.log(snapshotChild.val().frequency);

        firstTrainTime = snapshotChild.val().firstTrainTime;
        frequency = snapshotChild.val().frequency;

        var firstTimeConverted = moment(firstTrainTime, "HH:mm").subtract(1, "years");
        console.log(firstTimeConverted);

        var currentTime = moment();
        console.log("Current time: " + moment(currentTime).format("HH:mm"));

        var diffTime = moment().diff(moment(firstTimeConverted), "minutes");
        console.log("Difference in time: " + diffTime);

        var tRemainder = diffTime % frequency;
        console.log(tRemainder);

        var minutesAway = frequency - tRemainder;
        console.log("Minutes till train: " + minutesAway);

        var nextTrain = moment().add(minutesAway, "minutes");
        console.log("Next Arrival " + moment(nextTrain).format("HH:mm"));

        var newRow = $("<tr>").append(
            $("<td>").text(snapshotChild.val().trainName),
            $("<td>").text(snapshotChild.val().destination),
            $("<td>").text(snapshotChild.val().frequency),
            $("<td>").text(moment(nextTrain).format("HH:mm")),
            $("<td>").text(minutesAway),
            );

        $("#time-table>tbody").append(newRow);

    }, function (errorObject) {
        console.log("Errors handled: " + errorObject);
    });
});