import React, { Suspense, useState } from 'react';
import {Canvas, useThree} from "@react-three/fiber"
import { OrbitControls } from '@react-three/drei';
import Cube from "./Cube"
import {Col, Container, Row} from "react-grid-system"
import CSS from "csstype"

import './App.css';
import { Vector3 } from 'three';


globalThis.gamesCompleted = 0
globalThis.currentTime = new Date().getTime();

interface IProps {
}

interface IState {
  gamesCompleted: number,
  firstGame: number,
  secondGame: number,
  thirdGame: number,
  showStart: boolean,
  cubeCount: number,
  shapes: Array<number[][]>,
  selectedShape: number[][],
  selectedStyle: {border: string, borderStyle: string, width: string, height: string},
  notSelectedStyle: {border: string, borderStyle: string, width: string, height: string}
}


class App extends React.Component<IProps, IState>{
  constructor(props: IProps) {
    super(props);

    var shapesArray: Array<number[][]> = makeShapesArray()

    this.state = {
      gamesCompleted: 0,
      firstGame: 0,
      secondGame: 0,
      thirdGame: 0,
      showStart: true,
      cubeCount: 7,
      shapes: shapesArray,
      selectedShape: shapesArray[2],
      selectedStyle: {border: "white", borderStyle: "dashed", width: "132pt", height: "132pt"},
      notSelectedStyle: {border: "", borderStyle: "", width: "132pt", height: "132pt"}
    }

    this.handleChange = this.handleChange.bind(this)
    this.handleStartGame = this.handleStartGame.bind(this)
    this.handlePlayAgain = this.handlePlayAgain.bind(this)
  }


  handleStartGame = param => e => {
    globalThis.currentTime = new Date().getTime();
    this.setState({
      showStart: false
    })
  }

  handlePlayAgain = () => {

    globalThis.gamesCompleted = 0

    var shapesArray: Array<number[][]> = makeShapesArray()

    this.setState({
      showStart: true,
      gamesCompleted: 0,
      firstGame: 0,
      secondGame: 0,
      thirdGame: 0,
      shapes: shapesArray,
      selectedShape: shapesArray[2],
      selectedStyle: {border: "white", borderStyle: "dashed", width: "132pt", height: "132pt"},
      notSelectedStyle: {border: "", borderStyle: "", width: "132pt", height: "132pt"}

    })
  }

  
  handleChange = param => e => {
    // param is the argument you passed to the function
    // e is the event object that returned
    var shapes = this.state.shapes
    var selection = param
    shapes[1] = selection
    this.setState({
      shapes: shapes,
      selectedShape: selection
    }, () => {console.log("selection test", selection)})
  };


  IntroPage = () =>{
    return(
      <div >
            <h1>Welcome to the Shape Rotation game. </h1>
            <h3>The Game is simple. Choose the correct shape, and rotate it such that it matches the reference shape.</h3>
            <h3>You are scored by time.</h3>
            <h3>Good Luck!</h3>
            <button onClick={this.handleStartGame(1)} style={{width: "108pt", height: "36pt", fontSize: "18pt"}} >Start Game</button>
      </div>)
  }

  CompletedPage = () => {
    return(
    <div>
      <h1>Thanks for playing.</h1>
      <h3>Your Scores:</h3>
      <h3>Game 1: {globalThis.firstGame / 1000}s</h3>
      <h3>Game 2: {globalThis.secondGame / 1000}s</h3>
      <h3>Game 3: {globalThis.thirdGame / 1000}s</h3>
      <button onClick={this.handlePlayAgain} style={{width: "108pt", height: "36pt", fontSize: "18pt"}} >Play Again</button>

    </div>)
  }
  


  GetCameraPosition = () => {
    const state = useThree()


    var cameraX: number = state.camera.position.x
    var cameraY: number = state.camera.position.y
    var cameraZ: number = state.camera.position.z
  
  
    var xDiff: number = Math.abs(cameraX - 4)
    var yDiff: number = Math.abs(cameraY - 4 )
    var zDiff: number = Math.abs(cameraZ - 4 )
    const totalDiff:number = xDiff + yDiff + zDiff

    console.log("running get camera position", cameraX , cameraY, cameraZ)
    console.log("running get camera diff", xDiff , yDiff, zDiff, totalDiff)

    if (this.state.selectedShape === this.state.shapes[0]){
  
      if (totalDiff < 3){
        console.log("Victory Condition!")
        console.log("camera position", cameraX , cameraY, cameraZ)
        var now: number = new Date().getTime();
        if (now - globalThis.currentTime < 1000){
          //do nothing
        }
        else{
          globalThis.gamesCompleted = globalThis.gamesCompleted + 1
          if (globalThis.gamesCompleted === 1){
              globalThis.firstGame = now - globalThis.currentTime
          }
          if (globalThis.gamesCompleted === 2){
            globalThis.secondGame = now - globalThis.currentTime

          }
          if (globalThis.gamesCompleted === 3){
            globalThis.thirdGame = now - globalThis.currentTime
          }
          globalThis.currentTime = now
      
          this.handleVictory()

          state.camera.position.x = randomPositivity() * 4
          state.camera.position.y = randomPositivity() * 4
          state.camera.position.z = randomPositivity() * 4
          
          if (state.camera.position.x + state.camera.position.y + state.camera.position.z === 16 ){
            state.camera.position.x = -4
            state.camera.position.y = -4
          }

          state.camera.updateProjectionMatrix()

        }
      }
    }
  
    return <></>
  }

  handleVictory = () => {
    console.log("running handle victory", globalThis.gamesCompleted, globalThis.currentTime)
    var shapes = makeShapesArray()
    this.setState({
      shapes: shapes,
      selectedShape: shapes[2]
    }, () => {this.arbitraryUpdate()})
  }

  arbitraryUpdate = () => {
    this.setState({})
  }

    
  render(): React.ReactNode {
      console.log("running render")
      var randomPosition: THREE.Vector3 = new Vector3( randomPositivity() * 4, randomPositivity() * 4, randomPositivity() * 4 )
      var aStyle: CSS.Properties = this.state.notSelectedStyle
      var bStyle: CSS.Properties = this.state.notSelectedStyle
      var cStyle: CSS.Properties = this.state.notSelectedStyle
      var dStyle: CSS.Properties = this.state.notSelectedStyle

      if (this.state.selectedShape === this.state.shapes[2]){
        aStyle = this.state.selectedStyle
      }
      if (this.state.selectedShape === this.state.shapes[3]){
        var bStyle: CSS.Properties = this.state.selectedStyle
      }
      if (this.state.selectedShape === this.state.shapes[4]){
        var cStyle: CSS.Properties = this.state.selectedStyle
      }
      if (this.state.selectedShape === this.state.shapes[5]){
        var dStyle: CSS.Properties = this.state.selectedStyle
      }

      if (this.state.showStart){
        return(<div style={{ display: 'flex',  justifyContent:'center', alignItems:'center', height: '100vh', background: "#1c1c1c"}}>
            <this.IntroPage  />
          </div>
        )
      }
      else{
        if (globalThis.gamesCompleted > 2){
          return(<div style={{ display: 'flex',  justifyContent:'center', alignItems:'center', height: '100vh', background: "#1c1c1c"}}>
            <this.CompletedPage />
        </div>)
        }
        else{
          return(
            <div style={{ display: 'flex',  justifyContent:'center', alignItems:'center', height: '100vh', background: "#1c1c1c"}}>
              <Container fluid>
                <Row>
                  {/* //REFERENCE SHAPE */}
                  {/*shape 0*/}
                  <Col>
                      <h3>Match This Shape</h3>
                      <Canvas shadows style={{width: "266pt", height: "266pt"}} camera={{ position: [4, 4, 4]  }} >
                        <color attach="background" args={["black"]} />
                        <ambientLight intensity={1}/>
                        <Shape boxPositions={this.state.shapes[0]} color = {"#00FF00"} />
                      </Canvas>
                  </Col>
    
                  {/* //USERS SELECTED SHAPE */}
                                {/*shape 1*/}
    
                  <Col style={{marginLeft: "-24pt"}}>
                    <div>
                      <h3>With Your Shape</h3>
                        <Canvas mode={"legacy"}  shadows  camera={{ position: randomPosition  }}  style={{width: "266pt", height: "266pt", border: "white", borderStyle: "dashed"}} >
                          <this.GetCameraPosition />
                          <color attach="background" args={["black"]} />
                          <ambientLight intensity={1}/>
                          <Shape boxPositions={this.state.shapes[1]} color = {"#FF00FF"} />
                          <OrbitControls enableZoom={false}/>
                        </Canvas>
                        <button style={{height: '36pt', width : '72pt', fontSize: "18pt"}}
                          onClick={this.arbitraryUpdate}>Check</button>
                    </div>
                  </Col>
                </Row>
                <h3>Select Shape</h3>
                <Row>
                  {/* //SHAPE 2 */}
                    <Col>
                      <div onClick={this.handleChange(this.state.shapes[2])} style={aStyle}>
                        <Canvas camera={{ position: [randomPositivity() * 4, randomPositivity() * 4, randomPositivity() * 4]  }} >
                            <color attach="background" args={["black"]} />
                            <ambientLight intensity={1}/>
                            <Shape boxPositions={this.state.shapes[2]} color = {"#FF00FF"} />
                          </Canvas>
                      </div>
                    </Col>
                    {/* //SHAPE 3 */}
                    <Col style={{marginLeft: "-23pt"}}>
                      <div style={bStyle} onClick={this.handleChange(this.state.shapes[3])}>
                        <Canvas camera={{ position: [randomPositivity() * 4, randomPositivity() * 4, randomPositivity() * 4] }}>
                          <color attach="background" args={["black"]} />
                          <ambientLight intensity={1}/>
                          <Shape boxPositions={this.state.shapes[3]} color = {"#FF00FF"} />
                        </Canvas>
    
                      </div>
                    </Col>
                    {/* //SHAPE 4 */}
                    <Col style={{marginLeft: "-23pt"}}>
                      <div style={cStyle} onClick={this.handleChange(this.state.shapes[4])}>                    
                        <Canvas camera={{ position: [randomPositivity() * 4, randomPositivity() * 4, randomPositivity() * 4] }}  style={this.state.notSelectedStyle}>
                          <color attach="background" args={["black"]} />
                          <ambientLight intensity={1}/>
                          <Shape boxPositions={this.state.shapes[4]} color = {"#FF00FF"} />
                        </Canvas>
                      </div>
                    </Col>
                    {/* //SHAPE 5 */}
                    <Col style={{marginLeft: "-23pt"}}>
                      <div style={dStyle} onClick={this.handleChange(this.state.shapes[5])}>
                        <Canvas camera={{ position: [randomPositivity() * 4, randomPositivity() * 4, randomPositivity() * 4]  }}  style={this.state.notSelectedStyle}>
                          <color attach="background" args={["black"]} />
                          <ambientLight intensity={1}/>
                          <Shape boxPositions={this.state.shapes[5]} color = {"#FF00FF"} />
                        </Canvas>
    
                      </div>
                    </Col>
                </Row>            
              </Container>
            </div>
         )
        }
        
      }
  }

  
}


function randomPositivity(){
  var chosenValue = Math.random() < 0.5 ? -1 : 1;
  return chosenValue

}


interface ShapeProperties{
  boxPositions: number[][],
  color: string,
}

function Shape({boxPositions, color}: ShapeProperties) {
  var shapeComponents: JSX.Element[] = []

  var i: number = 0;
  while (i<boxPositions.length){
    var currentPosition:number[] = boxPositions[i]
    shapeComponents.push( <Cube key={Math.random() + i} x={currentPosition[0]} y={currentPosition[1]} z={currentPosition[2]} color={color} />)
    i++
  }


  return <>{shapeComponents}</>
}


function makeShapesArray(){

  var shapesArray:Array<number[][]> = Array<number[][]>()
  var i: number = 0;
  while (i<6){
    shapesArray.push(makeBoxPositions(7))
    i++
  }
  var correctPosition = getRandomInt(4) + 2
  shapesArray[correctPosition] = shapesArray[0]
  shapesArray[1] = shapesArray[2]

  return shapesArray
}




function makeBoxPositions(size: number){
  //start w/ a cube in the center and then begin building in each direction at random
  //the next cube must share a face with the last cube
  //the next cube must thus share 2 coordinate value w/ the last cube
  var positions: number[][] = []
  var x: number = 1
  positions.push([-1,-1,-1])
  while (x < size){
    var nextDirection: number = getRandomInt(3)
    if (nextDirection === 0){
      positions.push([positions[x-1][0] + 1, positions[x-1][1], positions[x-1][2] ])

    }
    if (nextDirection === 1){
      positions.push([positions[x-1][0], positions[x-1][1] + 1, positions[x-1][2] ])

    }
    if (nextDirection === 2){
      positions.push([positions[x-1][0], positions[x-1][1], positions[x-1][2] + 1 ])

    }
    x++
  }
  return positions
}

function getRandomInt(max: number) {
  return Math.floor(Math.random() * max);
}

export default App;
