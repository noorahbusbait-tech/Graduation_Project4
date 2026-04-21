
// Dummy data (replace with model output)
const days = ["Day 1","Day 2","Day 3","Day 4","Day 5","Day 6","Day 7",
              "Day 8","Day 9","Day 10","Day 11","Day 12","Day 13","Day 14"];

const losData = [5,6,5.5,6.2,6.8,7,6.5,6.7,7.2,7.5,7.1,6.9,7.3,7.6];
const occupancyData = [70,72,75,78,80,82,85,87,88,90,92,91,93,95];

// Length of Stay Chart
new Chart(document.getElementById("losChart"), {
    type: "line",
    data: {
        labels: days,
        datasets: [{
            label: "Length of Stay (Days)",
            data: losData,
            tension: 0.3
        }]
    }
});

// Bed Occupancy Chart
new Chart(document.getElementById("occupancyChart"), {
    type: "line",
    data: {
        labels: days,
        datasets: [{
            label: "Bed Occupancy (%)",
            data: occupancyData,
            tension: 0.3
        }]
    }
});

// Example Prediction Outputs
document.getElementById("patientStatus").innerText =
    "Stable (Low Risk of Readmission)";

document.getElementById("occupancyPrediction").innerText =
    "Expected to reach 95% capacity within 2 weeks";

document.getElementById("predOccupancy").innerText = "95%";
document.getElementById("predLOS").innerText = "7.6";
document.getElementById("predRisk").innerText = "12 patients";
document.getElementById("predConfidence").innerText = "89%";

function logout(){
    localStorage.clear();
    window.location="login.php";
}


fetch("outputs/finaloccupancy.json")
  .then(response => response.json())
  .then(data => {
    // 1. Update Shortage Risk Box
    const riskBox = document.getElementById("patientPrediction");
    if(riskBox && data.shortage_risk) {
        riskBox.innerHTML = `<strong>Shortage Risk:</strong> <span style="color: #d9534f;">${data.shortage_risk}</span>`;
    }

    // 2. Update the Table Box
    const occupancyBox = document.getElementById("occupancyResults");
    if(occupancyBox && data.forecast) {
        let tableHtml = `<strong>Next Week's Bed Occupancy:</strong>
                         <table style="width:100%; margin-top:10px; border-collapse: collapse; font-size: 0.9em;">
                            <tr style="border-bottom: 2px solid #333;">
                                <th style="text-align:left; padding: 8px;">Date</th>
                                <th style="text-align:right; padding: 8px;">Occupied</th>
                            </tr>`;

        data.forecast.forEach(row => {
            let roundedOcc = Math.round(row.Tuned_Predicted_Occupancy);
            tableHtml += `
                <tr style="border-bottom: 1px solid #eee;">
                    <td style="padding:8px;">${row.Date}</td>
                    <td style="padding:8px; text-align:right; font-weight:bold;">${roundedOcc} Beds</td>
                </tr>`;
        });
        tableHtml += `</table>`;
        occupancyBox.innerHTML = tableHtml;
    }
  })
  .catch(err => console.error("Error loading JSON:", err));
