// VARIABLES -------------------------------------------------------------------------------------------------------------------------------------------------------------------

const fs = require('fs');

//create relative paths
const path = require('path');
const scriptDirectory = __dirname;
const dataFolderPath = path.join(scriptDirectory, '..', 'Data');
const relativeCourseFilePath = 'coursedata.csv';
const relativeOutputFilePath = 'output_admin.csv';
const DataFilePath = path.join(dataFolderPath, relativeCourseFilePath);
const OutputFilePath = path.join(dataFolderPath, relativeOutputFilePath);


coursedata = [];
order = [];
sems = [];
schedule = [];

var sem = "F";
var year = 2020;
const num_sems = 8;

// GET DATA -------------------------------------------------------------------------------------------------------------------------------------------------------------------

try {
  // Read the entire file synchronously
  const data = fs.readFileSync(DataFilePath, 'utf8');

  // Split the data into lines
  const lines = data.split('\n');

  // Process each line
  for (let i = 0; i < lines.length; i++) {
    const items = lines[i].split(',');
    const course = items.map(item => item.trim());
    coursedata.push(course);
  }
} catch (err) {
  console.error('Error reading the file:', err);
}

// CREATE SEMESTERS -------------------------------------------------------------------------------------------------------------------------------------------------------------------

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

// GENERATE -------------------------------------------------------------------------------------------------------------------------------------------------------------------

//make priority lists for elective courses
fallEven = [];
fallOdd = [];
springEven = [];
springOdd = [];
fallOlympic = [];
springOlympic = [];

for (e = 0; e < coursedata.length; e++) {
  course_id = coursedata[e][0];
  priority = parseInt(coursedata[e][1]);
  switch (priority) {
    case 1:
      fallEven.push(course_id);
      fallOdd.push(course_id);
      springEven.push(course_id);
      springOdd.push(course_id);
      break;
    case 2:
      fallEven.push(course_id);
      springEven.push(course_id);
      break;
    case 3:
      springOdd.push(course_id);
      break;
    case 4:
      fallOdd.push(course_id);
      springEven.push(course_id);
      break;
    case 5:
      fallEven.push(course_id);
      break;
    case 6:
      springOdd.push(course_id);
      break;
    case 7:
      fallOdd.push(course_id);
      break;
    case 8:
      if (year % 4 == 0) {
        fallOlympic.push(course_id);
      }
      break;
    case 9:
      if (year % 4 == 0) {
        springOlympic.push(course_id);
      }
      break;
  }
}

//add priority lists to semesters in elective schedule
for (e = 0; e < schedule.length; e++) {
  s_priority = order[e];
  switch (s_priority) {
    case '125':
      schedule[e].push(fallEven);
      break;
    case '1258':
      schedule[e].push(fallEven);
      if (fallOlympic.length > 0) {
        schedule[e].push(fallOlympic);
      }
      break;
    case '147':
      schedule[e].push(fallOdd);
      break;
    case '124':
      schedule[e].push(springEven);
      break;
    case '1249':
      schedule[e].push(springEven);
      if (springOlympic.length > 0) {
        schedule[e].push(springOlympic);
      }
      break;
    case '136':
      schedule[e].push(springOdd);
      break;
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
