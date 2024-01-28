/* DOCUMENTATION -------------------------------------------------------------------------------------------------------------------------------------------------------------------

Proccessing required courses from reqs.csv
reqs[0] = course_id
reqs[1] = priority
reqs[2] = sem_order
reqs[3] = credits
reqs[4] = course_name
reqs[5] = course_description


Proccessing elective courses from electives.csv
electives[0] = course_id
  * starting with 0 = General Core requirements
  * starting with 1, 2, 3, 4 = CSCI
electives[1] = priority
electives[2] = course_name
electives[3] = course_description

Required parameters:
  sem - must be F or S
  year - starting year, must be 4 whole digits
  hours - 9, 12, 15, or 18
    9 = 14 semesters
    12 = 10 semesters
    15 = 8 semesters
    18 = 7 semesters


Priority Coding:
  Fall-Even: 1, 2, 5, 8**
  Fall-Odd: 1, 4, 7
  Spring-Even: 1, 2, 4, 9**
  Spring-Odd: 1, 3, 6
  
  ** only on olympic years (every 4 years)
*/

// VARIABLES -------------------------------------------------------------------------------------------------------------------------------------------------------------------
const fs = require('fs');

//create relative paths
const path = require('path');
const scriptDirectory = __dirname;
const dataFolderPath = path.join(scriptDirectory, '..', 'Data');

const relativeReqsFilePath = 'reqs.csv';
const ReqsFilePath = path.join(dataFolderPath, relativeReqsFilePath);

// const relativeElectFilePath = 'electives.csv';
// const ElectFilePath = path.join(dataFolderPath, relativeElectFilePath);

const relativeOutputFilePath = 'output_student.csv';
const OutputFilePath = path.join(dataFolderPath, relativeOutputFilePath);


reqs = [];
// electives = [];
order = [];
sems = [];
schedule = [];

var sem = "F";
var year = 2020;
const hours = 12;

const num_sems = Math.ceil(120 / hours); //Math.ceil will round up for the number of semesters
const credits = Math.ceil(hours / 3);

// GET DATA -------------------------------------------------------------------------------------------------------------------------------------------------------------------

try {
    //reqs data
    const req_data = fs.readFileSync(ReqsFilePath, 'utf8');
    const rlines = req_data.split('\n');

    for (let i = 0; i < rlines.length; i++) {
        const items = rlines[i].split(',');
        const course = items.map(item => item.trim());
        reqs.push(course);
    }

    //electives data
    // const elect_data = fs.readFileSync(ElectFilePath, 'utf8');
    // const elines = elect_data.split('\n');

    // for (let i = 0; i < elines.length; i++) {
    //     const items = elines[i].split(',');
    //     const course = items.map(item => item.trim());
    //     electives.push(course);
    // }
} catch (err) {
    console.error('Error reading the file:', err);
}

// GENERATE  -------------------------------------------------------------------------------------------------------------------------------------------------------------------

//create semester headers (F_2000, S_2001, etc.)
if (sem == "F") {
    for (i = 1; i <= num_sems; i++) {
        if (i % 2 !== 0) {
            s = "F_" + year;
            sems.push(s);
            year = year + 1;
        } else {
            s = "S_" + year;
            sems.push(s);
        }
    }
} else {
    for (i = 1; i <= num_sems; i++) {
        if (i % 2 !== 0) {
            s = "S_" + year;
            sems.push(s);
        } else {
            s = "F_" + year;
            sems.push(s);
            year = year + 1;
        }
    }
}

//create order array for priority checking
for (s = 0; s < sems.length; s++) {
    string = sems[s].split('_');
    semester = string[0];
    y = parseInt(string[1]);
    if (semester == "F") {
        if (y % 2 !== 0) {
            //fall odd
            order.push("147");
        } else {
            if (y % 4 == 0) {
                //olympic fall
                order.push("1258")
            } else {
                //fall even
                order.push("125")
            }
        }
    } else {
        if (y % 2 !== 0) {
            //spring odd
            order.push("136");
        } else {
            if (y % 4 == 0) {
                //olympic spring
                order.push("1249")
            } else {
                //spring even
                order.push("124")
            }
        }
    }
}

//add semesters to schedules as headers (first index of array)
schedule = sems.map(element => [element]);

function addCourse(course, prev) {
    //find nearest availble index (one that is not full)
    nearest = -1;
    for (s = 0; s < schedule.length; s++) {
        if (schedule[s].length < (credits + 3)) {
            nearest = s;
            break;
        }
    }

    //adjust nearest according to what prev is
    if (nearest !== -1) {
        if (nearest == prev) {
            nearest = nearest + 1;
        } else if (prev > nearest) {
            nearest = (prev - nearest) + nearest + 1;
        }
        //schedule[nearest].push(course);
    } else {
        console.warn("Schedule is full");
    }

    //adjust nearest according to priority
    course_priority = course[1];
    sem_priority = order[nearest];
    course_add = "CSCI " + course[0] + ": " + course[4];

    if (sem_priority.includes(course_priority)) {
        schedule[nearest].push(course_add);
        
    } else {
        do {
            nearest = nearest + 1;
            sem_priority = order[nearest];
        } while (!sem_priority.includes(course_priority) && (nearest >= schedule.length))

        schedule[nearest].push(course_add);
        
    }

    return nearest;
}

//add required courses
for (r = 1; r < reqs.length; r++) {
    o = parseInt(reqs[r][2]);
    switch (o) {
        case 1:
            prev = addCourse(reqs[r], -1);
            break;
        case 2:
            prev1 = addCourse(reqs[r], prev);
            break;
        case 3:
            prev2 = addCourse(reqs[r], prev1);
            break;
        case 4:
            prev3 = addCourse(reqs[r], prev2);
            break;
    }
}

//add fillers
for (s = 0; s < schedule.length; s++) {
    if (schedule[s].length <= (credits + 1)) {
        fill = (credits + 1) - schedule[s].length;
        for (f = 0; f < fill; f++) {
            schedule[s].push("Elective/Core");
        }
    }
}

// WRITE OUT -------------------------------------------------------------------------------------------------------------------------------------------------------------------
const csvString = schedule.map(row => row.join(',')).join('\n');
fs.writeFileSync(OutputFilePath, csvString, 'utf8');

// TESTING -------------------------------------------------------------------------------------------------------------------------------------------------------------------

// for (s = 0; s < schedule.length; s++) {
//   console.log(schedule[s]);
//   console.log('-----------------------------------------');
// }