import React, { useRef } from 'react'
import {useGLTF, useTexture} from '@react-three/drei'

export default function Model(props) {
  const group = useRef()
  const { nodes } = useGLTF('/clam-models/common/Tongues/forked.glb')
  const materialProps = useTexture({ normalMap: '/clam-models/tongue-normal.png' })
  const { tongueTexture, ...rest } = props

  return (
    <group ref={group} {...rest} dispose={null}>
      <group position={[0, 0, -0.01]} scale={0.281405}>
        <mesh
          castShadow
          receiveShadow
          geometry={nodes.cc_forked.geometry}
          position={[-0.021923, -0.021906, -0.124811]}
          rotation={[0.549713, 0, 0]}
          scale={25.940569}
        >
          <meshStandardMaterial attach="material" {...materialProps}>
            <canvasTexture attach="map" args={[tongueTexture]} />
          </meshStandardMaterial>
        </mesh>
      </group>
    </group>
  )
}

useGLTF.preload('/clam-models/common/Tongues/forked.glb')
