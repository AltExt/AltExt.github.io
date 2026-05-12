function ClearAll()
{
    document.getElementById("cowlDiameter").value = "";
    document.getElementById("cowlPitch").value = "";
    document.getElementById("insulationThickness").value = "";
    document.getElementById("additionalMaterial").value = "";
}
function PerformCalc()
{
    const CowlRad = GetNumber("cowlDiameter") / 2;
    const CowlPitch = GetNumber("cowlPitch") * Math.PI / 180;
    const InsulationThickness = GetNumber("insulationThickness");
    const AdditionalMaterial = GetNumber("additionalMaterial");

    console.log("CowlRad: " + CowlRad);
    console.log("CowlPitch: " + CowlPitch);
    console.log("InsulationThickness: " + InsulationThickness);
    console.log("AdditionalMaterial: " + AdditionalMaterial);

    // First we need to calc r1 and r2
    // do this with trig       2 triangles

    // first one along centreline to rad of cowl, at the cowl pitch
    // this gets R1

    const t1_opp = Math.tan((Math.PI / 2) - CowlPitch) * (CowlRad);
    console.log("t1_opp: " + t1_opp);
    const R1 = Math.sqrt((CowlRad * CowlRad) + (t1_opp * t1_opp));

    // second one from rad of cowl to outside of tank, at cowl pitch
    // this gets the distance from R1 to R2
    // and thus R2

    const CowlTotalHeight = InsulationThickness + AdditionalMaterial;

    const t2_opp = Math.tan(CowlPitch) * (CowlTotalHeight);
    console.log("t2_opp: " + t2_opp);
    const R2 = R1 + Math.sqrt((CowlTotalHeight * CowlTotalHeight) + (t2_opp * t2_opp)) ;

    const ArcLen = CowlRad * 2 * Math.PI;
    const ArcAngleInDegrees = (ArcLen / R1) * (180 / Math.PI);

    console.log("R1: " + R1);
    console.log("R2: " + R2);
    console.log("Arc Angle: " + ArcAngleInDegrees);

    document.getElementById("cowlInnerRadius").value = ToString(R1);
    document.getElementById("cowlOuterRadius").value = ToString(R2);
    document.getElementById("arcAngle").value = ToString(ArcAngleInDegrees);
}