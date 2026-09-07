# CPU Scheduler Viz

Build a complete, modern, responsive web application titled:

"CPU Scheduling Algorithm Visualizer & Comparative Analysis"

This is an academic university project for visualizing and comparing CPU scheduling algorithms.

IMPORTANT:

Build a fully functional application, not just a UI mockup.

All scheduling calculations must be implemented correctly in JavaScript/TypeScript.

The application must work without requiring a backend.

Use clean, modular code.

Make the UI professional enough for a university project demonstration and viva.

The application must be responsive for desktop, tablet, and mobile.

Use a clean modern dashboard design.

Use cards, tables, buttons, tabs, badges, and charts where appropriate.

Add smooth but subtle animations.

Do not overcomplicate the interface.

==================================================

TECHNOLOGY
==================================================

Use:

React

TypeScript

Tailwind CSS

Modern component-based architecture

Lucide icons or another clean icon library

Recharts or another suitable chart library for comparative graphs

No backend/database is required.

Store the current project/input data in browser state/local storage if useful.

==================================================
2. APPLICATION STRUCTURE

Create the following main navigation:

Dashboard

Algorithm Visualizer

Comparative Analysis

Algorithm Information

About Project

Use a sidebar navigation on desktop and a responsive navigation on mobile.

Application title:
"CPU Scheduling Visualizer"

Subtitle:
"Visualize, Analyze & Compare CPU Scheduling Algorithms"

==================================================
3. DASHBOARD

Create an attractive dashboard containing:

Hero section:
"CPU Scheduling Algorithm Visualizer"

Description:
"An interactive tool for visualizing CPU scheduling algorithms and comparing their performance."

Add two large buttons:

[Visualize Algorithm]
[Compare Algorithms]

Below that, create statistic cards:

Supported Algorithms: 5

Scheduling Type: Preemptive & Non-Preemptive

Visualization: Gantt Chart

Analysis: Performance Comparison

Add a section:
"Supported Algorithms"

Cards for:

FCFS
First Come First Serve
Non-Preemptive

SJF
Shortest Job First
Non-Preemptive

SRTF
Shortest Remaining Time First
Preemptive

Priority Scheduling
Non-Preemptive / optionally support preemptive mode if implemented

Round Robin
Preemptive

Each card should have a short description and a "Learn More" button.

==================================================
4. MODULE 1 — ALGORITHM VISUALIZATION

Create a page called:

"Algorithm Visualizer"

Purpose:
Allow the user to enter process information, select one scheduling algorithm, execute it, and visualize the result.

INPUT SECTION

Create an input card with:

Number of Processes

Algorithm selection dropdown:

FCFS

SJF

SRTF

Priority Scheduling

Round Robin

When Priority Scheduling is selected, show the Priority column.

When Round Robin is selected, show:

"Time Quantum"

with a numeric input.

Allow the user to dynamically create process rows.

Default number of processes: 4.

Each process should have:

Process ID
Arrival Time
Burst Time
Priority

Example:

P1 | 0 | 5 | 2
P2 | 1 | 3 | 1
P3 | 2 | 4 | 3
P4 | 4 | 2 | 2

Buttons:

[Add Process]
[Remove Process]
[Load Example]
[Clear]
[Run Algorithm]

Input validation:

Process ID must be unique.

Arrival Time must be >= 0.

Burst Time must be > 0.

Priority must be a valid number.

Time Quantum must be > 0.

Number of processes must be at least 1.

Display clear validation messages.

==================================================
5. SCHEDULING ALGORITHMS

Implement the following algorithms correctly.

A. FCFS

First Come First Serve.

Rules:

Sort/select processes according to arrival time.

Execute each process completely before moving to the next.

If no process is available, CPU becomes IDLE.

Generate Gantt chart segments.

Calculate:

Completion Time

Turnaround Time

Waiting Time

Formula:

Turnaround Time = Completion Time - Arrival Time

Waiting Time = Turnaround Time - Burst Time

B. SJF

Shortest Job First, non-preemptive.

Rules:

At every scheduling decision, choose the available process with the shortest burst time.

If multiple processes have the same burst time, use earlier arrival time as tie breaker.

If still tied, use process ID/order.

CPU should become IDLE if no process is available.

Calculate:

Completion Time

Turnaround Time

Waiting Time

C. SRTF

Shortest Remaining Time First, preemptive.

Rules:

At every time unit, select the available process with the smallest remaining burst time.

A newly arrived shorter process can preempt the currently running process.

Correctly handle CPU idle time.

Merge consecutive Gantt chart segments belonging to the same process where appropriate.

Calculate:

Completion Time

Turnaround Time

Waiting Time

D. PRIORITY SCHEDULING

Implement non-preemptive Priority Scheduling.

Use the following rule:

Smaller priority number = higher priority.

Rules:

Among available processes, select the process with the highest priority.

If priority is equal, use earlier arrival time.

If still equal, use process order.

Handle CPU idle time correctly.

Calculate:

Completion Time

Turnaround Time

Waiting Time

E. ROUND ROBIN

Implement preemptive Round Robin.

Rules:

Use a ready queue.

Each process receives CPU for at most the specified Time Quantum.

If the process is not finished, place it back into the ready queue.

Correctly handle newly arrived processes.

Correctly handle CPU idle periods.

Correctly calculate completion time.

Calculate:

Completion Time

Turnaround Time

Waiting Time

==================================================
6. GANTT CHART

After clicking "Run Algorithm", display a large Gantt chart.

Example:

| P1 | P2 | P3 | IDLE | P4 |
0 5 8 12 15 17

Create the Gantt chart dynamically based on the algorithm result.

Requirements:

Each process should appear as a separate block.

Display process ID inside each block.

Display start time and end time.

Display IDLE blocks when CPU is idle.

Make the chart horizontally scrollable if it becomes wide.

Use visually distinct colors for different processes.

Add a legend if necessary.

Show total execution time.

Add a small animation when the Gantt chart is generated.

==================================================
7. PROCESS RESULT TABLE

Below the Gantt chart display:

"Process Scheduling Results"

Columns:

Process ID
Arrival Time
Burst Time
Priority
Completion Time
Turnaround Time
Waiting Time

Example:

P1 | 0 | 5 | 2 | 5 | 5 | 0
P2 | 1 | 3 | 1 | 8 | 7 | 4
P3 | 2 | 4 | 3 | 12 | 10 | 6
P4 | 4 | 2 | 2 | 14 | 10 | 8

Highlight the best/lowest waiting time if appropriate.

==================================================
8. PERFORMANCE SUMMARY

After the result table show summary cards:

Average Waiting Time
Average Turnaround Time
Total CPU Idle Time
CPU Utilization
Throughput

Calculate:

Average Waiting Time =
Sum of Waiting Time / Number of Processes

Average Turnaround Time =
Sum of Turnaround Time / Number of Processes

CPU Idle Time =
Total time during which no process is executing.

CPU Utilization =
(Busy CPU Time / Total Elapsed Time) × 100

Throughput =
Number of completed processes / Total elapsed time

Format values to 2 decimal places where appropriate.

==================================================
9. MODULE 2 — COMPARATIVE ANALYSIS

Create a separate page:

"Comparative Analysis"

Purpose:
Allow the user to select two or more scheduling algorithms and compare their performance.

ALGORITHM SELECTION

Provide checkboxes:

☐ FCFS
☐ SJF
☐ SRTF
☐ Priority Scheduling
☐ Round Robin

Require at least TWO algorithms.

If Round Robin is selected, show Time Quantum.

Use the same process input data for all selected algorithms by default because this provides a fair comparison.

Also allow the user to edit the process data before comparison.

Buttons:

[Load Example]
[Clear]
[Compare Algorithms]

==================================================
10. COMPARATIVE GANTT CHARTS

After comparison, display a separate Gantt chart for every selected algorithm.

Example:

FCFS Gantt Chart
[ P1 ][ P2 ][ P3 ][ P4 ]

SJF Gantt Chart
[ P1 ][ P4 ][ P2 ][ P3 ]

SRTF Gantt Chart
[ P1 ][ P2 ][ P1 ][ P3 ]

Round Robin Gantt Chart
[ P1 ][ P2 ][ P1 ][ P3 ][ P2 ]

Each chart must show:

Process IDs

Start time

End time

IDLE blocks where applicable

Make each chart visually clear and responsive.

==================================================
11. COMPARATIVE SUMMARY TABLE

Create a table:

Algorithm
Average Waiting Time
Average Turnaround Time
CPU Idle Time
CPU Utilization
Throughput

Example:

FCFS | 5.25 | 9.00 | 2 | 87.50% | 0.25
SJF | 3.50 | 7.25 | 2 | 87.50% | 0.25
SRTF | 2.75 | 6.50 | 2 | 87.50% | 0.25
Priority | 4.00 | 7.75 | 2 | 87.50% | 0.25
Round Robin | 4.80 | 8.20 | 2 | 87.50% | 0.25

IMPORTANT:
The values above are only examples for UI/reference.
Do NOT hardcode these values.
Calculate all values dynamically from the user's input.

==================================================
12. COMPARISON CHARTS

Create visual comparison charts.

Chart 1:
Average Waiting Time by Algorithm

Chart 2:
Average Turnaround Time by Algorithm

Chart 3:
CPU Idle Time by Algorithm

Use bar charts.

The chart should update dynamically according to the selected algorithms.

Add a short automatically generated interpretation.

Example:

"Based on the current input, SRTF produced the lowest average waiting time, while FCFS produced the highest average waiting time."

Do not hardcode the statement.
Generate it dynamically from actual results.

==================================================
13. PERFORMANCE WINNER

Create a section:

"Performance Summary"

Automatically identify:

Lowest Average Waiting Time
Lowest Average Turnaround Time
Highest CPU Utilization
Lowest CPU Idle Time

Display badges such as:

Best Waiting Time
Best Turnaround Time
Best CPU Utilization

Important:
Do not claim one algorithm is universally best.
The winner must be based only on the current user input.

==================================================
14. ALGORITHM INFORMATION PAGE

Create an educational page explaining all five algorithms.

For each algorithm show:

Full name

Scheduling type

Preemptive/non-preemptive

Basic working principle

Advantages

Disadvantages

Suitable use cases

Important characteristics

Include:

FCFS:
Simple and fair by arrival order but can suffer from convoy effect.

SJF:
Can provide low average waiting time but requires knowledge/estimation of burst times.

SRTF:
Preemptive version of SJF and can reduce waiting time but causes more context switching.

Priority:
Executes higher-priority processes first; may cause starvation for low-priority processes.

Round Robin:
Uses time quantum and provides fairness, especially suitable for time-sharing systems.

==================================================
15. ABOUT PROJECT PAGE

Title:

"About the Project"

Content:

Project Title:
"Designing Algorithm Visualizer for CPU Scheduling Algorithms"

Purpose:
"This project provides an interactive visualization and comparative analysis platform for CPU scheduling algorithms. It helps users understand how scheduling decisions affect waiting time, turnaround time, CPU utilization, and overall performance."

Project modules:

Module 1:
Algorithm Visualization

Module 2:
Comparative Analysis

Add a section:

"Learning Objectives"

Understand CPU scheduling concepts.

Visualize scheduling behavior using Gantt charts.

Calculate scheduling performance metrics.

Compare different scheduling algorithms.

Understand preemptive and non-preemptive scheduling.

==================================================
16. USER EXPERIENCE

Make the interface beginner-friendly.

Use:

Clear labels

Tooltips

Helpful error messages

Empty states

Loading/processing animation

Responsive tables

Confirmation messages where appropriate

Use a professional academic color scheme.

Do not use excessive gradients or flashy effects.

The website should look like a polished university software engineering project.

==================================================
17. SAMPLE DATA

Provide a "Load Example" button.

Use this sample:

Process | Arrival Time | Burst Time | Priority

P1 | 0 | 5 | 2
P2 | 1 | 3 | 1
P3 | 2 | 4 | 3
P4 | 4 | 2 | 2

For Round Robin use:

Time Quantum = 2

Do not hardcode the expected results.
Run the actual algorithms to calculate them.

==================================================
18. EDGE CASES

The algorithms must correctly handle:

All processes arriving at time 0.

Processes arriving at different times.

CPU idle periods.

Two processes with the same arrival time.

Two processes with the same burst time.

Equal priorities.

A very small time quantum.

A time quantum larger than burst time.

Only one process.

Many processes.

Processes with long burst times.

Preemption caused by newly arrived processes.

==================================================
19. CODE QUALITY

Separate scheduling logic from UI logic.

Create reusable functions such as:

calculateFCFS()
calculateSJF()
calculateSRTF()
calculatePriority()
calculateRoundRobin()

Create reusable components such as:

ProcessInputTable
AlgorithmSelector
GanttChart
ResultTable
PerformanceSummary
ComparisonChart
AlgorithmCard

Use TypeScript interfaces/types for:

Process
GanttSegment
SchedulingResult
ComparisonResult

Do not duplicate calculation logic unnecessarily.

==================================================
20. IMPORTANT CORRECTNESS REQUIREMENTS

The application is an academic CPU scheduling project, so calculation correctness is extremely important.

For every algorithm verify:

Completion Time

Turnaround Time

Waiting Time

Average Waiting Time

Average Turnaround Time

CPU Idle Time

Use:

Turnaround Time = Completion Time - Arrival Time

Waiting Time = Turnaround Time - Burst Time

Never display negative waiting time.

Never ignore arrival times.

Correctly account for CPU idle periods.

For preemptive algorithms, completion time must represent the time when the process finally finishes.

==================================================
21. TESTING SECTION

Add a small developer/test section if appropriate that allows verification of algorithm results.

Include a few predefined test cases.

Test Case 1:
All arrival times = 0.

Test Case 2:
Different arrival times with CPU idle time.

Test Case 3:
Multiple processes arriving at the same time.

Test Case 4:
Round Robin with quantum = 2.

Use these only for testing and demonstration.

==================================================
22. FINAL POLISH

Before finishing:

Make sure there are no TypeScript errors.

Make sure all buttons work.

Make sure all algorithms actually execute.

Make sure Gantt charts are generated from calculated results.

Make sure comparison charts use calculated results.

Make sure tables are responsive.

Make sure the application works with different user inputs.

Make sure there is no hardcoded result pretending to be a calculation.

Make sure navigation works.

Make sure the UI looks professional.

Add footer:

"CPU Scheduling Visualizer — Academic Project"

Add a small note:

"Designed for educational visualization and comparative analysis of CPU scheduling algorithms."

The final application should feel like a complete university-level project rather than a simple demo.

This project was built with [Lovable](https://lovable.dev).

**Live app**: https://cpu-viz-compare.lovable.app

## Build with Lovable

Continue developing this project in the [Lovable editor](https://lovable.dev/projects/9c303d8a-2314-49f1-9453-f3e9b64295a4).

- **Ship faster**: describe what you want to build and Lovable handles the code.
- **Stay in sync**: every change made in Lovable is committed straight to this repository.
- **Full ownership**: this code is yours. Push to `main` on GitHub and your changes sync back into Lovable, ready for your next prompt.

## Development

Prefer working locally? You need Node.js and npm — [install with nvm](https://github.com/nvm-sh/nvm#installing-and-updating).

```sh
git clone <this-repository-url>
cd <repository-name>
npm i
npm run dev
```
