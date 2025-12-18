---
nav: Threads
order: 6
---

# Take high quality screenshots of videos

```jsx
import React, { useCallback, useRef, useState, useEffect } from 'react';
import { Button, Flex, InputNumber, Switch, Typography } from 'antd';
import { CameraOutlined } from '@ant-design/icons';
import { screenshotService } from 'ft2025/infrastructure/screenshot';
import { uploadScreenshot } from 'ft2025/app/screenshot';
import { setupApiMocks } from 'ft2025/mocks/api-mocks';
import video4k from '../assets/10s-4k-video.mp4';

const DEFAULT_TARGET_WIDTH = 3840;

export default () => {
  const contentRef = useRef(null);

  const [ready, setReady] = useState(false);
  const [targetWidth, setTargetWidth] = useState(DEFAULT_TARGET_WIDTH);
  const [useClone, setUseClone] = useState(true);

  useEffect(() => {
    let alive = true;
    setupApiMocks().then(() => alive && setReady(true));
    return () => {
      alive = false;
    };
  }, []);

  const takeScreenshot = useCallback(async () => {
    if (!contentRef.current || !ready) {
      console.warn("It's not ready to take the screenshot");
      return;
    }

    const canvas = await screenshotService.captureScreenshot(
      contentRef.current,
      {
        targetWidth,
        useClone,
      },
    );

    const blob = await screenshotService.convertToBlob(canvas);

    await uploadScreenshot({ image: blob });
  }, [ready, targetWidth, useClone]);

  return (
    <Flex vertical gap="middle" align="center">
      <Button
        type="primary"
        icon={<CameraOutlined />}
        onClick={() => takeScreenshot()}
      >
        {'Take a screenshot'}
      </Button>
      <Flex gap="small" align="center" wrap="wrap">
        <Flex gap="small" align="center">
          <Typography.Text>Target width</Typography.Text>
          <InputNumber
            min={640}
            max={7680}
            step={160}
            value={targetWidth}
            onChange={(value) => setTargetWidth(value ?? DEFAULT_TARGET_WIDTH)}
          />
        </Flex>
        <Flex gap="small" align="center">
          <Typography.Text>Use clone</Typography.Text>
          <Switch checked={useClone} onChange={setUseClone} />
        </Flex>
      </Flex>
      <div ref={contentRef}>
        <video
          src={video4k}
          autoPlay
          muted
          controls={false}
          playsInline
          disablePictureInPicture
          onContextMenu={(e) => e.preventDefault()}
          style={{
            pointerEvents: 'none',
            width: 500,
            height: 'auto',
            objectFit: 'contain',
          }}
        />
      </div>
    </Flex>
  );
};
```
