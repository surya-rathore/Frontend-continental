import React, { useState } from "react";
import Logo from "./assets/logo.png";
import "./App.css";
function App() {
  const [chid, setChid] = useState("");
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [DOB, setDOB] = useState("");
  const [genderAge, setGenderAge] = useState("");
  const [emergencyNo, setEmergencyNo] = useState("");
  const [patientImage, setpatientImage] = useState("");
  const [imageName, setImageName] = useState("");

  const searchChid = async () => {
    try {
      const response = await fetch("http://localhost:5000/api/patient/search", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ chid }), // sending only chid
      });

      const data = await response.json();
      console.log("response data:", data);
      // auto fill fields from backend response
      setFirstName(data.firstname);
      setGenderAge(data.gender);
      setEmergencyNo(data.emergencyNo);
      setpatientImage(`http://localhost:5000/images/${data.patientimage}.jpg`);
      setImageName(`${data.patientimage}.jpg`);
      const formatDOB = (dob) => {
        const [day, month, year] = dob.split("/");

        const months = [
          "Jan",
          "Feb",
          "Mar",
          "Apr",
          "May",
          "Jun",
          "Jul",
          "Aug",
          "Sep",
          "Oct",
          "Nov",
          "Dec",
        ];

        return `${day}-${months[parseInt(month) - 1]}-${year}`;
      };
      setDOB(formatDOB(data.DOB));
      setLastName(data.lastName);
      // setpatientImage(data.patientimage);
    } catch (error) {
      console.log(error);
    }
  };
  console.log("image name:", patientImage);
  const clearForm = () => {
    setChid("");
    setFirstName("");
    setGenderAge("");
    setEmergencyNo("");
    setpatientImage("");
    setImageName("");
    setDOB("");
    setLastName("");
  };
  const handlePrint = () => {
    const printContent = document.getElementById("printCard").innerHTML;

    const newWindow = window.open("", "", "width=400,height=300");

    newWindow.document.write(`
<html>
<head>
<style>

@page{
  size: landscape;
  margin:0;
}
html,body{ 
margin:0;
padding:0; 
width:100%; 
height:100%; 
font-family:Arial; 
}
.card{ 
position: relative;
top:20px;
width:350PX; 
height:150px; 
padding:10px; 
display:flex; 
justify-content:space-between; 
align-items:center; 
box-sizing:border-box;
// transform: rotate(180deg);
} 
.card-left{ 
display:flex; 
flex-direction:column; 
gap:6px; 
} 
.card-right{ 
margin-left:80px;
display:flex; 
flex-direction:column; 
align-items:center; 
gap:2px;
} 
.qr{ 
width:20px;
height:20px; 
} 
.patient-photo{ 
width:90px; 
height:90px; 
object-fit:cover; 
} 
#chid{ 
margin:0; 
font-size:18px; 
}

</style>
</head>

<body>
${printContent}
</body>
</html>
`);

    newWindow.document.close();
    newWindow.print();
  };

  return (
    <>
      <div className="maincontainer">
        <div className="navbar">
          <h2 className="formname">Registration Card Print</h2>
        </div>

        {/* CHID Row */}
        <div className="content">
          <div className="chid">
            <label><samp style={{fontWeight:"bold", fontSize:"18px"}}>CHID:</samp></label>
            <input
              className="chidinput"
              value={chid}
              onChange={(e) => setChid(e.target.value)}
            />
          </div>

          <div className="searchbutton">
            <button className="buttonsearch" onClick={searchChid}>
              Search
            </button>
          </div>
        </div>

        {/* First Name */}
        <div className="content">
          <div className="chid">
            <label><span style={{ fontWeight: 'bold', fontSize: '18px' }}>First Name:</span></label>
            <input className="nameinput" value={firstName} readOnly />
          </div>

          <div className="searchbutton">
            <button className="printbutton" onClick={handlePrint}>
              Print
            </button>
          </div>
        </div>
        {/* Last Name */}
        <div className="content">
          <div className="chid">
            <label><span style={{ fontWeight: 'bold', fontSize: '18px' }}>Last Name:</span></label>
            <input className="nameinput" value={lastName} readOnly />
          </div>
          <div className="searchbutton">
            <button className="clearbutton" onClick={clearForm}>
              Clear
            </button>
          </div>
        </div>

        {/* Gender Age */}
        <div className="content">
          <div className="chid">
            <label><span style={{ fontWeight: 'bold', fontSize: '18px' }}>Gender/Age:</span></label>
            <input
              className="genderinput"
              value={`${genderAge && DOB ? `${genderAge}` : ''}${genderAge && DOB && "  / "}${DOB || ''}`}
              readOnly
            />
          </div>
          <div className="searchbutton">
            <button className="closebutton">Close</button>
          </div>
        </div>

        <div className="bottomcontenter">
          <div className="contentdiv">
            {/* Emergency No */}
            <div className="content">
              <div className="chid">
                <label><span style={{ fontWeight: 'bold', fontSize: '18px' }}>Emergency No:</span></label>
                <input
                  className="emergencynoinput"
                  value={emergencyNo}
                  readOnly
                />
              </div>
            </div>
            {/* Image */}
            <div className="content">
              <div className="chid">
                <label><span style={{ fontWeight: 'bold', fontSize: '18px' }}>Patient Image:</span><span style={{ fontWeight: 'bold' }}>{imageName}</span></label>
              </div>
            </div>
          </div>
          {/* image display */}
          <div className="imagediv">
            {patientImage && <img src={patientImage} width="90" height="90" />}
          </div>
        </div>
      </div>

      {/* print page*/}
      <div id="printCard" className="print-card">
        <div className="card">
          <div className="card-left">
            <div className="patient-info">
              <p>{firstName}</p>
              <p>{lastName}</p>
              <p>
                {genderAge}
                {genderAge && DOB && "  / "}
                {DOB}
              </p>
              <p>{emergencyNo}</p>
            </div>
            <img src={Logo} width="30" height="30" />
          </div>

          <div className="card-right">
            <img src={patientImage} className="patient-photo" />
            <p id="chid" className="card-number">
              {chid}
            </p>
          </div>
        </div>
      </div>
    </>
  );
}

export default App;
