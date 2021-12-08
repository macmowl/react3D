import React, { useRef, Suspense, useState, useEffect } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { useGLTF, OrbitControls, ContactShadows, Environment } from '@react-three/drei';
import { proxy, useSnapshot } from 'valtio';
import { HexColorPicker } from 'react-colorful';

const state = proxy({
  current: null,
  items: {
    laces: "#ffffff",
    mesh: "#ffffff",
    caps: "#ffffff",
    inner: "#ffffff",
    sole: "#ffffff",
    stripes: "#ffffff",
    band: "#ffffff",
    patch: "#ffffff",
  }
});

function Shoe() {
    const ref = useRef()
    const snap = useSnapshot(state)
    const { nodes, materials } = useGLTF("shoe.glb")
  
    // Animate model
    useFrame((state) => {
      const t = state.clock.getElapsedTime()
      ref.current.rotation.z = -0.2 - (1 + Math.sin(t / 1.5)) / 20
      ref.current.rotation.x = Math.cos(t / 4) / 8
      ref.current.rotation.y = Math.sin(t / 4) / 8
      ref.current.position.y = (1 + Math.sin(t / 1.5)) / 10
      ref.current.position.z = 0
    })
  
    // Cursor showing current color
    const [hovered, setHovered] = useState(null);
    
    useEffect(() => {
      document.body.style.cursor = hovered ? "pointer" : "auto";
    });
  
    // Using the GLTFJSX output here to wire in app-state and hook up events
    return (
      <group
        ref={ref}
        dispose={null}
        onPointerOver={(e) => (e.stopPropagation(), setHovered(e.object.material.name))}
        onPointerOut={(e) => e.intersections.length === 0 && setHovered(null)}
        onPointerMissed={() => (state.current = null)}
        onPointerDown={(e) => (e.stopPropagation(), (state.current = e.object.material.name))}>
        <mesh geometry={nodes.shoe.geometry} material={materials.laces} material-color={snap.items.laces} />
        <mesh geometry={nodes.shoe_1.geometry} material={materials.mesh} material-color={snap.items.mesh} />
        <mesh geometry={nodes.shoe_2.geometry} material={materials.caps} material-color={snap.items.caps} />
        <mesh geometry={nodes.shoe_3.geometry} material={materials.inner} material-color={snap.items.inner} />
        <mesh geometry={nodes.shoe_4.geometry} material={materials.sole} material-color={snap.items.sole} />
        <mesh geometry={nodes.shoe_5.geometry} material={materials.stripes} material-color={snap.items.stripes} />
        <mesh geometry={nodes.shoe_6.geometry} material={materials.band} material-color={snap.items.band} />
        <mesh geometry={nodes.shoe_7.geometry} material={materials.patch} material-color={snap.items.patch} />
      </group>
    )
  }

function Picker() {
  const snap = useSnapshot(state);
  console.log(snap.current);
  return(
    <div style={{display: snap.current ? 'block' : 'none'}}>
    <HexColorPicker className="picker" 
      color={snap.items[snap.current]}
      onChange={(color) => (state.items[snap.current] = color)}
    />
      <h1>{snap.current}</h1>
    </div>
  )
}

export default function App() {
  return (
    <>
      <Picker />
      <Canvas>
        <ambientLight intensity={0.5} />
        <spotLight position={[10, 15, 10]} angle={0.3} />
        <Suspense fallback={null}>
          <Shoe />
          <Environment files="royal_esplanade_1k.hdr" />
          <ContactShadows rotation-x={Math.PI / 2} position={[0, -0.8, 0]} opacity={0.25} width={10} height={10} blur={2} far={1}/>
        </Suspense>
        <OrbitControls />
      </Canvas>
      
    </>
  )
}
