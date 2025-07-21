import {
  AfterViewInit,
  Component,
  ElementRef,
  OnDestroy,
  ViewChild
} from '@angular/core';
import * as faceapi from 'face-api.js';

@Component({
  selector: 'app-webcam',
  templateUrl: 'web-cam.component.html',
  styleUrls: ['./web-cam.component.css']
})
export class WebcamComponent implements AfterViewInit, OnDestroy {
  @ViewChild('video',  { static: true }) videoRef!: ElementRef<HTMLVideoElement>;
  @ViewChild('canvas', { static: true }) canvasRef!: ElementRef<HTMLCanvasElement>;

  private streamInterval!: number;
  private descriptorsMap: Record<string, Float32Array> = {};
  private faceMatcher!: faceapi.FaceMatcher;
  private readonly photosPath = '/assets/labeled_images';

  async ngAfterViewInit(): Promise<void> {
    const MODEL_URL = '/assets/models';

    // 1) Load Face API models
    await Promise.all([
      faceapi.nets.tinyFaceDetector.loadFromUri(MODEL_URL),
      faceapi.nets.faceLandmark68Net.loadFromUri(MODEL_URL),
      faceapi.nets.faceRecognitionNet.loadFromUri(MODEL_URL)
    ]);

    // 2) Load descriptors from manifest
    await this.loadDescriptors();

    // 3) Build FaceMatcher with a 0.6 threshold
    const labeledDescriptors = Object.entries(this.descriptorsMap).map(
      ([label, desc]) => new faceapi.LabeledFaceDescriptors(label, [desc])
    );
    this.faceMatcher = new faceapi.FaceMatcher(labeledDescriptors, 0.6);

    // 4) Start camera and recognition loop
    await this.startVideoStream();
  }

  ngOnDestroy(): void {
    clearInterval(this.streamInterval);
    const video = this.videoRef.nativeElement;
    if (video.srcObject instanceof MediaStream) {
      (video.srcObject as MediaStream).getTracks().forEach(t => t.stop());
    }
  }

  private async loadDescriptors(): Promise<void> {
    const manifestUrl = `${this.photosPath}/manifest.json`;
    let labels: string[] = [];
    try {
      labels = await fetch(manifestUrl).then(r => r.json());
    } catch (err) {
      console.error('Could not load manifest:', err);
      return;
    }

    for (const label of labels) {
      const imgUrl = `${this.photosPath}/${label}.jpeg`;
      try {
        const img = await faceapi.fetchImage(imgUrl);
        const det = await faceapi
          .detectSingleFace(img, new faceapi.TinyFaceDetectorOptions())
          .withFaceLandmarks()
          .withFaceDescriptor();
        if (det && det.descriptor) {
          this.descriptorsMap[label] = det.descriptor;
        } else {
          console.warn(`No descriptor for ${label}`);
        }
      } catch {
        console.warn(`Failed to fetch or detect ${imgUrl}`);
      }
    }
  }

  private async startVideoStream(): Promise<void> {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ video: true });
      const video = this.videoRef.nativeElement;
      video.srcObject = stream;
      await video.play();
      this.streamInterval = window.setInterval(() => this.detectAndMatch(), 100);
    } catch (err) {
      console.error('Webcam error:', err);
    }
  }

  private async detectAndMatch(): Promise<void> {
    const video = this.videoRef.nativeElement;
    const canvas = this.canvasRef.nativeElement;
    const ctx = canvas.getContext('2d')!;

    canvas.width = video.videoWidth;
    canvas.height = video.videoHeight;
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    // detect faces + descriptors
    const results = await faceapi
      .detectAllFaces(video, new faceapi.TinyFaceDetectorOptions())
      .withFaceLandmarks()
      .withFaceDescriptors();

    for (const res of results) {
      const box = res.detection.box;
      // use FaceMatcher to find best match or 'unknown'
      const match = this.faceMatcher.findBestMatch(res.descriptor);
      const label = match.label;
      const dist = match.distance;

      // draw bounding box
      ctx.strokeStyle = 'red';
      ctx.lineWidth = 2;
      ctx.strokeRect(box.x, box.y, box.width, box.height);

      // draw label
      ctx.font = '16px sans-serif';
      ctx.fillStyle = 'red';
      ctx.fillText(`${label} (${dist.toFixed(2)})`, box.x, box.y - 6);
    }
  }
}
