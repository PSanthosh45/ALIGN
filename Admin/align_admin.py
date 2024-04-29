# VARIABLES & IMPORTS ------------------------------------------------------------------------------------------------------------------------------------
import csv

global headerRow
global courseinfo
global coursecount
global semesters
global rotsched
FallEvenList = []
SpringEvenList = []
FallOddList = []
SpringOddList = []

# ROUTINES ------------------------------------------------------------------------------------------------------------------------------------

def GetData():
    cInfo = []
    count = 0
    with open('coursedata.csv','r') as datafile:
        csvread = csv.reader(datafile)
        hRow = next(csvread)
        for course in csvread:
            cInfo.append(course)
            count = count + 1
    return hRow, cInfo, count

def GenSem():
    sem = input("What semester do you want to start with? (F or S) \n")
    year1 = int(input("What year do you want to start with? \n"))
    year2 = year1 + 1
    year3 = year1 + 2
    year4 = year1 + 3
    year5 = year1 + 4

    if sem == 'F' or sem == 'f':
        sem = sem.upper()
        osem = 'S'
        sem1 = (sem + "_" + str(year1))
        sem2 = (osem + "_" + str(year2))
        sem3 = (sem + "_" + str(year2))
        sem4 = (osem + "_" + str(year3))
        sem5 = (sem + "_" + str(year3))
        sem6 = (osem + "_" + str(year4))
        sem7 = (sem + "_" + str(year4))
        sem8 = (osem + "_" + str(year5))
    elif sem == 'S' or sem == 's':
        sem = sem.upper()
        osem = 'F'
        sem1 = (sem + "_" + str(year1))
        sem2 = (osem + "_" + str(year1))
        sem3 = (sem + "_" + str(year2))
        sem4 = (osem + "_" + str(year2))
        sem5 = (sem + "_" + str(year3))
        sem6 = (osem + "_" + str(year3))
        sem7 = (sem + "_" + str(year4))
        sem8 = (osem + "_" + str(year4))
    
    sems = [sem1, sem2, sem3, sem4, sem5, sem6, sem7, sem8]
    return sems

def FallEven(year):
    for c in courseinfo:
        course_num = c[0]
        priority = int(c[1])
        # coreq = int(c[2])
        # prereq = int(c[3])
        # prereq_and = int(c[4])
        # prereq_or = int(c[5])
        course_name = c[6]

        #Fall even courses: priority = 1, 2, 5
        if priority == 1 or priority == 2 or priority == 5:
            course = "CSCI " + course_num + ": " + course_name
            FallEvenList.append(course)
        
        #Check if olympic year
        if year%4 == 0:
            if priority == 8: 
                course = "CSCI " + course_num + ": " + course_name
                FallEvenList.append(course)

def SpringEven(year):
    for c in courseinfo:
        course_num = c[0]
        priority = int(c[1])
        # coreq = int(c[2])
        # prereq = int(c[3])
        # prereq_and = int(c[4])
        # prereq_or = int(c[5])
        course_name = c[6]

        #Spring even courses: priority = 1,4,7,9*
        if priority == 1 or priority == 4 or priority == 7:
            course = "CSCI " + course_num + ": " + course_name
            SpringEvenList.append(course)
        
        #Check if olympic year
        if year%4 == 0:
            if priority == 9: 
                course = "CSCI " + course_num + ": " + course_name
                SpringEvenList.append(course)

def FallOdd():
    for c in courseinfo:
        course_num = c[0]
        priority = int(c[1])
        # coreq = int(c[2])
        # prereq = int(c[3])
        # prereq_and = int(c[4])
        # prereq_or = int(c[5])
        course_name = c[6]

        #Fall Odd courses: priority = 1,2,4
        if priority == 1 or priority == 2 or priority == 4:
            course = "CSCI " + course_num + ": " + course_name
            FallOddList.append(course)

def SpringOdd():
    for c in courseinfo:
        course_num = c[0]
        priority = int(c[1])
        # coreq = int(c[2])
        # prereq = int(c[3])
        # prereq_and = int(c[4])
        # prereq_or = int(c[5])
        course_name = c[6]

        #Spring Even courses: priority = 1,3,6
        if priority == 1 or priority == 3 or priority == 6:
            course = "CSCI " + course_num + ": " + course_name
            SpringOddList.append(course)

def GenLists(semarr):
    for sem in semarr:
        checksem = sem.split('_')
        csem = checksem[0]
        cyear = int(checksem[1])

        # MAKE COURSE LISTS
        #even year
        if cyear%2 == 0:
            #fall
            if csem == "F":
                FallEven(cyear)
            #spring
            elif csem == 'S':
                SpringEven(cyear)
        #odd year
        else:
            #fall
            if csem == 'F':
                FallOdd()
            #spring
            elif csem == "S":
                SpringOdd()

def GenSched(semarr):
    rotsched = []
    for sem in semarr:
        checksem = sem.split('_')
        csem = checksem[0]
        cyear = int(checksem[1])

        #even year
        if cyear%2 == 0:
            #fall
            if csem == "F":
                apparr = []
                apparr.append(sem)
                for course in FallEvenList:
                    apparr.append(course)
                rotsched.append(apparr)
            #spring
            elif csem == 'S':
                apparr = []
                apparr.append(sem)
                for course in SpringEvenList:
                    apparr.append(course)
                rotsched.append(apparr)
        #odd year
        else:
            #fall
            if csem == 'F':
                apparr = []
                apparr.append(sem)
                for course in FallOddList:
                    apparr.append(course)
                rotsched.append(apparr)
            #spring
            elif csem == "S":
                apparr = []
                apparr.append(sem)
                for course in SpringOddList:
                    apparr.append(course)
                rotsched.append(apparr)
    return rotsched

def WriteOut(arr):
    # w = overwrites (also creates new file if missing)
    csvfile = open('Admin\\rotsched_admin.csv','w')
    for a in arr:
        for i in a:
            csvfile.write(i + ',')
        csvfile.write('\n')
    csvfile.close


# PROGRAM ------------------------------------------------------------------------------------------------------------------------------------

headerRow,courseinfo,coursecount = GetData()
semesters = GenSem()
GenLists(semesters)    
rotsched = GenSched(semesters)
WriteOut(rotsched)