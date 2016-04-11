//This is the calendar code! no touchy!

var arr = [];
var CLIENT_ID = '315899277116-mpn9sgsbn0h3gcal95sumvh9prcf2k6n.apps.googleusercontent.com';

var SCOPES = ["https://www.googleapis.com/auth/calendar.readonly"];

/**
 * Check if current user has authorized this application.
 */
function checkAuth() {
    gapi.auth.authorize(
        {
            'client_id': CLIENT_ID,
            'scope': SCOPES.join(' '),
            'immediate': true
        }, handleAuthResult);
}

/**
 * Handle response from authorization server.
 *
 * @param {Object} authResult Authorization result.
 */
function handleAuthResult(authResult) {
    var authorizeDiv = document.getElementById('authorize-div');
    if (authResult && !authResult.error) {
        // Hide auth UI, then load client library.
        authorizeDiv.style.display = 'none';
        loadCalendarApi();
    } else {
        // Show auth UI, allowing the user to initiate authorization by
        // clicking authorize button.
        authorizeDiv.style.display = 'inline';
    }
}

/**
 * Initiate auth flow in response to user clicking authorize button.
 *
 * @param {Event} event Button click event.
 */
function handleAuthClick(event) {
    gapi.auth.authorize(
        {client_id: CLIENT_ID, scope: SCOPES, immediate: false},
        handleAuthResult);
    return false;
}

/**
 * Load Google Calendar client library. List upcoming events
 * once client library is loaded.
 */
function loadCalendarApi() {
    gapi.client.load('calendar', 'v3', listUpcomingEvents);
}

/**
 * Print the summary and start datetime/date of the next ten events in
 * the authorized user's calendar. If no events are found an
 * appropriate message is printed.
 */
function listUpcomingEvents() {
    var d = new Date();
    var midnight = Date.parse('12AM');
    var request = gapi.client.calendar.events.list({
        'calendarId': 'atkanp6sii451jnpiih313r72o@group.calendar.google.com',
        'timeMin': (new Date()).toISOString(),
        'showDeleted': false,
        'singleEvents': true,
        'maxResults': 6,
        'orderBy': 'startTime'
    });

    request.execute(function(resp) {
        var events = resp.items;
        appendPre('Upcoming events:');

        if (events.length > 0) {
            for (i = 0; i < events.length; i++) {
                var event = events[i];
                var when = event.start.dateTime;
                if (!when) {
                    when = event.start.date;
                }
                appendPre(event.summary + ' (' + when + ')');
                arr.push(event.summary + ' (' + when + ')');
            }
        } else {
            appendPre('No more events for today!.');
        }

    });
}

/**
 * Append a pre element to the body containing the given message
 * as its text node.
 *
 * @param {string} message Text to be placed in pre element.
 */
function appendPre(message) {
    var pre = document.getElementById('output');
    var textContent = document.createTextNode(message + '\n');
    arr.forEach(function(entry){
        var hour;
        var minute;
        var dayType;
        var timeString = entry.substring(entry.lastIndexOf("(")+1,entry.lastIndexOf(")"));
        var time = Date.parse(timeString).toString();
        var timeArr = time.split(" ");
        var first = entry.split(" ")[0];
        var simpleTime = timeArr[4].toString().split(":");
        if (simpleTime[0] > 12){
            hour = parseInt(simpleTime[0]);
            hour = hour - 12;
            hour = hour.toString();
            minute = simpleTime[1];
            dayType = "PM";
        }
        else{
            hour = simpleTime[0];
            minute = simpleTime[1];
            dayType = "AM"
        }
        $(".event").append("<form method='post' action='/sign/"+ first +"'><button class='btn btn-link signin' style='text-decoration: none; color: white;' type='submit'> "+ first + " on " + timeArr[0] +" "+"the"+" " + timeArr[2] + " "+ "at" +" "+ + hour +  ":" + minute + " " + dayType + "</button></form><br>");


    });
    arr=[];
}


// End of the calendar code! Carry On!
var val = 0;
$('.signin').click(function(){
    val++;
    if (val==1){
        console.log("Signed In!");
    }
    else if (val ==2){
        $('.signup').hide();
        console.log("signed out!")
    }
});
