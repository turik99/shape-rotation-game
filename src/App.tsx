import React, {useEffect, useState} from 'react';
import { Canvas, useThree } from "@react-three/fiber"
import { OrbitControls  } from '@react-three/drei';
import Cube from "./Cube"
import { Col, Container, Row } from "react-grid-system"
import CSS from "csstype"
import {isMobile} from 'react-device-detect';
import Confetti from 'react-confetti';

import './App.css';
function App() {


  const [showIntro, updateIntro] = useState(true)
  const [shareCameraInfo, updateCameraInfo] = useState(false)
  const [checkCount, updateCheckCount] = useState(0)
  const [gamesPlayed, updateGamesPlayed] = useState(0)
  const [shapesArray, updateShapesArray] = useState(makeShapesArray())
  const [firstTimeStamp, setFirstTimeStamp] = useState(0)
  const [secondTimeStamp, setSecondTimeStamp] = useState(0)
  const [thirdTimeStamp, setThirdTimeStamp] = useState(0)
  const [fourthTimeStamp, setFourthTimeStamp] = useState(0)
  const [stylesArray, setStylesArray] = useState(createStyleArray(2))
  const [showConfetti, setConfetti] = useState({show: false, colors: ["#FFAAFF"]})
  const [referencePosition, updateReferencePosition] = useState([-4,4,4])

  console.log("start of function ")
  function createStyleArray(index: number){
    var array: CSS.Properties[] = []
    var unSelectedStyle: CSS.Properties = {borderColor: "#0a0a0a", marginRight:0, marginLeft: 0, borderWidth: "medium", borderStyle: "dashed", width: "144pt", height: "144pt"}
    var selectedStyle: CSS.Properties = {borderColor: "white", marginRight:0, marginLeft: 0, borderWidth: "medium", borderStyle: "dashed", width: "144pt", height: "144pt"}
    var referenceStyle: CSS.Properties = {width: "228pt", height: "228pt" }
    var yourShapeStyle: CSS.Properties = {width: "228pt", height: "228pt", border: "white", borderStyle: "dashed"}
    if (isMobile){
      console.log("mobile first run")
      referenceStyle.width = "108pt"
      referenceStyle.height = "108pt"

      yourShapeStyle.width = "108pt"
      yourShapeStyle.height = "108pt"

      unSelectedStyle.width = "108pt"
      unSelectedStyle.height = "108pt"

      selectedStyle.width= "108pt"
      selectedStyle.height = "108pt"

      referenceStyle.width= "108pt"
      referenceStyle.height= "108pt"
    }
    array[0] = referenceStyle
    array[1] = yourShapeStyle
    array[2] = unSelectedStyle
    array[3] = unSelectedStyle
    array[4] = unSelectedStyle
    array[5] = unSelectedStyle

    array[index] = selectedStyle

    return array
  }

  function runConfetti(won: boolean){
    var colorsArray = ["#00FFFF", "#FF4BCD"]
    if (!won){
      colorsArray = ["#FF0000"]
    }
    setConfetti({show: true, colors: colorsArray})
      const timer = setTimeout(() => setConfetti({show: false, colors: colorsArray}), 750);
    return () => clearTimeout(timer);
  }

  function removeIntro(){
    updateIntro(prevValue => false)
    setFirstTimeStamp(new Date().getTime())
  }

  function setNewShapes(){
    var shapes = makeShapesArray()
    
    updateShapesArray(shapes)
    var positions:number[] = [randomPositivity() * 4, randomPositivity() * 4, randomPositivity() * 4 ]

    console.log("updating shapes and setting new coords ", positions)

    updateReferencePosition(positions)
  }

  function handleVictory(){
    var now: number = new Date().getTime()
    if (((now - firstTimeStamp) / 1000 ) < 1){
      //do nothing because it's running too early for some reasonf
      console.log("handle victory running too early")
    }
    else{
      runConfetti(true)
      console.log("handle victory")
      setNewShapes()
      if (gamesPlayed + 1 === 1){
        setSecondTimeStamp(new Date().getTime())
      }
      if (gamesPlayed + 1 === 2){
        setThirdTimeStamp(new Date().getTime())

      }
      if (gamesPlayed + 1 === 3){
        setFourthTimeStamp(new Date().getTime())
      }
      setStylesArray(createStyleArray(2))
      updateGamesPlayed(gamesPlayed + 1)

    }
    updateCameraInfo(false)
  }

  function selectShape(shape: number[][], index: number){
    console.log("selected shape", shape)
    updateShapesArray(prevShapes => {
      var shapes = prevShapes
      shapes[1] = shape
      return {...prevShapes, shapes}
    })
    setStylesArray(createStyleArray(index))
  }

  function handlePlayAgain() {
    // updateGamesPlayed(0)
    // setFirstTimeStamp(0)
    // setSecondTimeStamp(0)
    // setThirdTimeStamp(0)
    // setFourthTimeStamp(0)
    // setNewShapes()
    // setStylesArray(createStyleArray(2))
    // updateIntro(true)
    window.location.reload()
  }


  useEffect(() =>{
    console.log("useEffect check")
    updateCameraInfo(true)
  }, [checkCount])

  if (showIntro){
    console.log("show intro")
    return(
      <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh', background: "#0a0a0a", paddingLeft: "6pt", paddingRight: "6pt"}}>
        <IntroPage />
      </div>)
  }
  console.log("get camera info 1 "+ shareCameraInfo)
  

  if (gamesPlayed === 3){
    console.log("show completed page")
    return(<div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh', background: "#0a0a0a", paddingLeft: "6pt", paddingRight: "6pt"}}>
      <CompletedPage />
    </div>)
  }
  else{

    var clickOrTap: string = "Click and drag to rotate 🖱"
    if (isMobile){
      clickOrTap = "Touch to rotate 👇"
    }
    var tryAgainStyle: CSS.Properties = {visibility: "hidden", marginBottom: 0, marginTop: 0}

    var tryAgainMessage: string = "Try Again!"
    var visibilityOfTryAgain = showConfetti.show
    if (visibilityOfTryAgain === true){
      if (showConfetti.colors[0] === "#FF0000"){
        tryAgainStyle = {visibility: "visible", color: "#FF0000", marginBottom: 0, marginTop: 0}
        tryAgainMessage = "Try Again!"
      }
      else{
        console.log(showConfetti.colors, "fck fuck fuck")
        tryAgainStyle = {visibility: "visible", color: "#00FFFF", marginBottom: 0, marginTop: 0}
        tryAgainMessage = "Correct!"
      }
    }
    var selectedCanvas = <Canvas shadows camera={{ position: [4,4,4] }} style={stylesArray[1]} >
        <color attach="background" args={["black"]} />
        <ambientLight intensity={1} />
        <Shape boxPositions={shapesArray[1]} color={"#FF00FF"} />
        <OrbitControls enableZoom={false} />
        <GetCameraInfo referenceShape={false} />
      </Canvas>

    var gamesLeft:number = 3 - gamesPlayed
    var shapesLeft:string = gamesLeft + " shapes remaining"
    if (gamesLeft === 1){
      shapesLeft = gamesLeft +  " shape remaining"
    }
    return (
      <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh', background: "#0a0a0a" }}>
        <Container fluid>
        
        <h2 style={{marginTop:0, flex: 1, flexDirection: "row", textAlign: "right"}}>{shapesLeft}</h2>

          <Row style={{marginTop: 0}}>
            {/* //REFERENCE SHAPE */}
            {/*shape 0*/}
            <Col style={{marginTop: 0}}>
              <h3 style={{marginTop: 0}}>Match this Shape</h3>
              <Canvas mode={"concurrent"} shadows style={stylesArray[0]} camera={{ position: [referencePosition[0], referencePosition[1], referencePosition[2]] }} >
                <color attach="background" args={["black"]} />
                <ambientLight intensity={1} />
                <Shape boxPositions={shapesArray[0]} color={"#00FF00"} />
                <GetCameraInfo referenceShape = {true} />
              </Canvas>
            </Col>
  
            {/* //USERS SELECTED SHAPE */}
            {/*shape 1*/}

            <Col style={{ marginLeft: "-24pt" }}>
              <div>
                <CustomConfetti />
                <h3 style={{marginTop: 0}}>{clickOrTap}</h3>
                {selectedCanvas}
                  <button  style={{ fontSize: "18pt" }} 
                  onClick={() => {updateCheckCount(checkCount + 1)}}>Check</button>
                  <p style={tryAgainStyle}>{tryAgainMessage}</p>
              </div>
            </Col>
          </Row>
          <h3>Select Shape</h3>
          <Row>
            {/* //SHAPE 2 */}
            <Col style={{marginLeft: 0, marginRight: 0}}  >
              <div style={{marginLeft: 0, marginRight: 0}}  onClick={ () => selectShape(shapesArray[2], 2) } >
                <Canvas style={stylesArray[2]} camera={{ position: [randomPositivity() * 4, randomPositivity() * 4, randomPositivity() * 4] }} >
                  <color attach="background" args={["black"]} />
                  <ambientLight intensity={1} />
                  <Shape boxPositions={shapesArray[2]} color={"#FF00FF"} />
                </Canvas>
              </div>
            </Col>
            {/* //SHAPE 3 */}
            <Col style={{marginLeft: 0, marginRight: 0}} >
              <div style={{marginLeft: 0, marginRight: 0}}  onClick={() => selectShape(shapesArray[3], 3) }>
                <Canvas style={stylesArray[3]} camera={{ position: [randomPositivity() * 4, randomPositivity() * 4, randomPositivity() * 4] }}>
                  <color attach="background" args={["black"]} />
                  <ambientLight intensity={1} />
                  <Shape boxPositions={shapesArray[3]} color={"#FF00FF"} />
                </Canvas>
  
              </div>
            </Col>
            {/* //SHAPE 4 */}
            <Col style={{marginLeft: 0, marginRight: 0}} >
              <div style={{marginLeft: 0, marginRight: 0}}  onClick={() => selectShape(shapesArray[4], 4) }>
                <Canvas style={stylesArray[4]} camera={{ position: [randomPositivity() * 4, randomPositivity() * 4, randomPositivity() * 4] }} >
                  <color attach="background" args={["black"]} />
                  <ambientLight intensity={1} />
                  <Shape boxPositions={shapesArray[4]} color={"#FF00FF"} />
                </Canvas>
              </div>
            </Col>
            {/* //SHAPE 5 */}
            <Col style={{marginLeft: 0, marginRight: 0}} >
              <div style={{marginLeft: 0, marginRight: 0}}   onClick={() => selectShape(shapesArray[5], 5) }>
                <Canvas style={stylesArray[5]} camera={{ position: [randomPositivity() * 4, randomPositivity() * 4, randomPositivity() * 4] }} >
                  <color attach="background" args={["black"]} />
                  <ambientLight intensity={1} />
                  <Shape boxPositions={shapesArray[5]} color={"#FF00FF"} />
                </Canvas>
              </div>
            </Col>
          </Row>
        </Container>
      </div>)
  }

  function CustomConfetti(){
    var width: number = 400

    if (isMobile){
      width = 144
    }
    else{
      width = 336
    }
    console.log("width is " + width)
    return (
      <div style={{position: "relative"}}>
        <Confetti
            recycle={false}
            gravity={.75}
            confettiSource={{x: 0, y:(width/4), w: width, h: 0}}
            tweenDuration={250}
            colors={showConfetti.colors}
            width={width}
            height={width * 1.1}
            opacity={.5}
            run={showConfetti.show}
            numberOfPieces={100} /> 
          </div>)
  }

  function GetCameraInfo(props){

    console.log("running GetCameraInfo")
    const { camera } = useThree();
    console.log("testing GetCameraInfo", camera)

    if (props.referenceShape === true){
      console.log("reference check cam", camera.position.x , camera.position.y , camera.position.z , shapesArray[0])
      console.log("reference check " ,referencePosition)
      camera.position.set(referencePosition[0], referencePosition[1], referencePosition[2])
      camera.lookAt(0,0,0)
      camera.updateProjectionMatrix()
    }
    else{
      var diff = Math.abs(camera.position.x - referencePosition[0]) + Math.abs(camera.position.y - referencePosition[1]) + Math.abs(camera.position.z - referencePosition[2])
    
      var x = camera.position.x
      var y = camera.position.y
      var z = camera.position.z
  
      if (shareCameraInfo){
        console.log("yes share cam info")
    
        if (shapesArray[0] === shapesArray[1]){
          console.log("user coords", x,y,z)
          console.log("reference coords ", referencePosition[0], referencePosition[1], referencePosition[2])
          if (diff < 5){
  
            console.log("diff is small")
  
            handleVictory()
          }
          else{
            console.log("didn't get it right!")
            runConfetti(false)
        
          }
        }
        else{
          var now = new Date().getTime()
          if (((now - firstTimeStamp) / 1000 ) < 1){
            
          }
          else{
            runConfetti(false)
          }
        }
        updateCameraInfo(false)
      }
      else{
        console.log("no share cam info")  
      }
    }



    return <></>
  };

  function CompletedPage(){
    var message: string = ""
    var messageStyle: CSS.Properties = { color: "black", background: "linear-gradient( to right, #FF4BCD, #00FFFF)", marginBottom: 0, marginTop: "3pt" }
    var firstScore:number = (secondTimeStamp - firstTimeStamp) / 1000
    var secondScore:number = (thirdTimeStamp - secondTimeStamp) / 1000
    var thirdScore:number = (fourthTimeStamp - thirdTimeStamp) / 1000

    firstScore = Math.round((firstScore + Number.EPSILON) * 100) / 100;
    secondScore = Math.round((secondScore + Number.EPSILON) * 100) / 100;
    thirdScore = Math.round((thirdScore + Number.EPSILON) * 100) / 100;


    var totalScore: number = (firstScore) + (secondScore) + (thirdScore)
    totalScore = Math.round((totalScore + Number.EPSILON) * 100) / 100;

    if (totalScore < 15) {
      message = "Impressive speed! You're a true shape rotator!"
    }
    if (totalScore > 45) {
      message = "Taylor Lorenz, is that you? You rotate slowly!"
    }
    if (totalScore>15 && totalScore < 45){
      console.log("total score: ", totalScore)
      messageStyle.width="96pt"
      message = "Well done."
    }

    return (
      <div>
        <h1 style={{marginBottom: 0}}>Thanks for playing!</h1>
        <h2 style={{margin: "2pt"}}>Your Scores:</h2>
        <h3 style={{margin: "2pt"}}>Shape 1: {firstScore}s</h3>
        <h3 style={{margin: "2pt"}}>Shape 2: {secondScore}s</h3>
        <h3 style={{margin: "2pt"}}>Shape 3: {thirdScore}s</h3>
        <h3 style={{margin: "2pt"}}>Total: {totalScore}s</h3>
        <h2 style={messageStyle}>{message}</h2>
        <button onClick={handlePlayAgain} style={{fontSize: "18pt", fontWeight: "bold", marginTop: "18pt", marginLeft: -.5}} >Play Again</button>
        <p style={{margin: 0}}></p>
        <button style={{marginTop: "18pt", fontSize: "14pt", fontWeight: "bold", marginLeft: -1, background: "#1DA1F2", borderRadius: 7, borderStyle: "solid", borderColor: "#1DA1F2", color: "white"}} onClick={()=>{window.open("https://twitter.com/MegabasedChad")}}>Connect with me on Twitter</button>

        <p><a style={{marginTop: "18pt"}} href="https://roonscape.substack.com/p/a-song-of-shapes-and-words">read about shape rotation</a></p>


      </div>)
  }

  function IntroPage() {
    var mouseOrTouch:string = "Click the shape to rotate it."
    if (isMobile){
      mouseOrTouch = "Touch the shape to rotate it."
    }
    return (
      <div style={{ width: "368pt"}}>
        <h2 >Welcome to the Shape Rotation game!</h2>
        <p>Choose the correct shape, and rotate it such that it matches the reference shape. You will be given 3 Shapes.
          {mouseOrTouch}</p>
        <h3>You are scored by time.</h3>
        <h3>Good Luck!</h3>
        <button onClick={removeIntro} style={{ height: "36pt", fontSize: "18pt", fontWeight: "bold" }} >Start Game</button>
        <p></p>
      </div>)
  }
}





  function randomPositivity() {
    var chosenValue = Math.random() < 0.5 ? -1 : 1;
    return chosenValue

  }


  interface ShapeProperties {
    boxPositions: number[][],
    color: string,
  }

  function Shape({ boxPositions, color }: ShapeProperties) {
    var shapeComponents: JSX.Element[] = []
    var i: number = 0;
    while (i < boxPositions.length) {
      var currentPosition: number[] = boxPositions[i]
      shapeComponents.push(<Cube key={Math.random() + i} x={currentPosition[0]} y={currentPosition[1]} z={currentPosition[2]} color={color} />)
      i++
    }


    return <>{shapeComponents}</>
  }


  function makeShapesArray() {

    var shapesArray: Array<number[][]> = Array<number[][]>()
    var i: number = 0;
    while (i < 6) {
      shapesArray.push(makeBoxPositions(7))
      i++
    }
    var correctPosition = getRandomInt(4) + 2
    shapesArray[correctPosition] = shapesArray[0]
    shapesArray[1] = shapesArray[2]

    return shapesArray
  }




  function makeBoxPositions(size: number) {
    //start w/ a cube in the center and then begin building in each direction at random
    //the next cube must share a face with the last cube
    //the next cube must thus share 2 coordinate value w/ the last cube
    var positions: number[][] = []
    var x: number = 1
    positions.push([-1, -1, -1])
    while (x < size) {
      var nextDirection: number = getRandomInt(3)
      if (nextDirection === 0) {
        positions.push([positions[x - 1][0] + 1, positions[x - 1][1], positions[x - 1][2]])

      }
      if (nextDirection === 1) {
        positions.push([positions[x - 1][0], positions[x - 1][1] + 1, positions[x - 1][2]])

      }
      if (nextDirection === 2) {
        positions.push([positions[x - 1][0], positions[x - 1][1], positions[x - 1][2] + 1])

      }
      x++
    }
    return positions
  }

  function getRandomInt(max: number) {
    return Math.floor(Math.random() * max);
  }

  export default App