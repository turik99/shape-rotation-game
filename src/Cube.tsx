import React from 'react';

class Cube extends React.Component<{x: number, y: number, z: number, color: string}>{

  render(): React.ReactNode {  
      return(
          <Box x={this.props.x} y={this.props.y} z={this.props.z} color={this.props.color} />
     )
  }
}

interface CubeProperties{
  x: number,
  y: number, 
  z: number,
  color: string
}


function Box({x, y, z, color}: CubeProperties){
  return(<mesh key={(x) + y + z + color} position={[x, y, z]}>
    <boxBufferGeometry attach="geometry"></boxBufferGeometry>
    <meshNormalMaterial  attach="material"></meshNormalMaterial>
  </mesh>)
}

export default Cube
