/**
 * MovementClassifier class
 *
 * Defines a model for skeleton movements
 * Classify movements
 * Loads models
 *
 **/

class MovementClassifier {
  constructor({ width, height }) {
    this.video = createCapture(VIDEO);
    this.video.size(width, height);
    this.video.hide();

    this.knnClassifier = ml5.KNNClassifier();

    this.featureExtractor = ml5.featureExtractor(
      "MobileNet",
      this.onFeaturesReady
    );
  }

  load = () => {};
  save = () => {};

  onFeaturesReady = () => {
    this.classifier = ml5.imageClassifier("MobileNet", this.onClassifierReady);
  };

  onClassifierReady = () => {
    this.poseNet = ml5.poseNet(this.video, this.onModelReady);
  };

  onModelReady = () => {
    this.poseNet.on("pose", results => {
      this.poses = results;
    });
    this.loaded = true;
  };

  addSample = (imageData, label) => {
    const features = this.featureExtractor.infer(imageData);
    this.knnClassifier.addExample(features, label);
  };

  classify = () => {
    // Get the total number of labels from knnClassifier
    const numLabels = knnClassifier.getNumLabels();
    if (numLabels <= 0) {
      console.error("There is no examples in any label");
      return;
    }
    const features = this.featureExtractor.infer(getFrameImage().imageData);
    // Use knnClassifier to classify which label do these features belong to
    this.knnClassifier.classify(features, gotResults);
  };
}
