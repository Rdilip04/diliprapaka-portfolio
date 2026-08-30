'use client';

import { useRef, useState } from 'react';
import { getImageProps } from 'next/image';
import { motion, useMotionValue, useSpring } from 'motion/react';
import './tilted-card.css';

const springValues = {
  damping: 30,
  stiffness: 100,
  mass: 2
};

export default function TiltedCard({
  imageSrc,
  altText = 'Tilted card image',
  captionText = '',
  width = '300px',
  height = '300px',
  scaleOnHover = 1.1,
  rotateAmplitude = 14,
  eager = false
}) {
  const ref = useRef(null);

  // The image has to stay a motion.img for the tilt, so the optimised src and
  // srcset are pulled off next/image rather than rendering <Image> itself.
  const { props: imageProps } = getImageProps({
    src: imageSrc,
    alt: altText,
    width: parseInt(width, 10),
    height: parseInt(height, 10),
    loading: eager ? 'eager' : 'lazy'
  });

  const x = useMotionValue(0);
  const y = useMotionValue(0);
  const rotateX = useSpring(useMotionValue(0), springValues);
  const rotateY = useSpring(useMotionValue(0), springValues);
  const scale = useSpring(1, springValues);
  const opacity = useSpring(0);
  const rotateFigcaption = useSpring(0, {
    stiffness: 350,
    damping: 30,
    mass: 1
  });

  const [lastY, setLastY] = useState(0);

  function handleMouse(e) {
    if (!ref.current) return;

    const rect = ref.current.getBoundingClientRect();
    const offsetX = e.clientX - rect.left - rect.width / 2;
    const offsetY = e.clientY - rect.top - rect.height / 2;

    const rotationX = (offsetY / (rect.height / 2)) * -rotateAmplitude;
    const rotationY = (offsetX / (rect.width / 2)) * rotateAmplitude;

    rotateX.set(rotationX);
    rotateY.set(rotationY);

    x.set(e.clientX - rect.left);
    y.set(e.clientY - rect.top);

    const velocityY = offsetY - lastY;
    rotateFigcaption.set(-velocityY * 0.6);
    setLastY(offsetY);
  }

  function handleMouseEnter() {
    scale.set(scaleOnHover);
    opacity.set(1);
  }

  function handleMouseLeave() {
    opacity.set(0);
    scale.set(1);
    rotateX.set(0);
    rotateY.set(0);
    rotateFigcaption.set(0);
  }

  return (
    <figure
      ref={ref}
      className="tilted-card-figure"
      style={{
        height,
        width
      }}
      onMouseMove={handleMouse}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
    >
      <motion.div
        className="tilted-card-inner"
        style={{
          width,
          height,
          rotateX,
          rotateY,
          scale
        }}
      >
        <motion.img
          {...imageProps}
          className="tilted-card-img"
          style={{
            width,
            height
          }}
        />
      </motion.div>

      <motion.figcaption
        className="tilted-card-caption"
        style={{
          x,
          y,
          opacity,
          rotate: rotateFigcaption
        }}
      >
        {captionText}
      </motion.figcaption>
    </figure>
  );
}
