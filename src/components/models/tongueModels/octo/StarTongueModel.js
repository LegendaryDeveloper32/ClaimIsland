import React, { useRef } from 'react'
import { useGLTF } from '@react-three/drei'

export default function Model(props) {
  const group = useRef()
  const { nodes } = useGLTF('/clam-models/octo/Tongues/star.glb')
  return (
    <group ref={group} {...props} dispose={null}>
      <group scale={0.863168}>
        <mesh
          castShadow
          receiveShadow
          geometry={nodes.cc_star3.geometry}
          position={[-0.019825, -0.034977, -0.042079]}
          rotation={[0.074829, -0.369653, 0.01508]}
          scale={0.76047}
        />
      </group>
    </group>
  )
}

useGLTF.preload('/clam-models/octo/Tongues/star.glb')
