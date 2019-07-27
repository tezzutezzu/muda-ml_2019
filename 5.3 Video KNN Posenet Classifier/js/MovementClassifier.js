/**
 * MovementClassifier class
 *
 * Defines a model for skeleton movements
 * Classify movements
 * Loads models
 *
 **/

class MovementClassifier {
  constructor({ width, height, onLoaded }) {
    this.knnClassifier = ml5.KNNClassifier();
    this.onLoaded = onLoaded;

    this.featureExtractor = ml5.featureExtractor(
      "MobileNet",
      this.onFeaturesReady
    );
  }

  load = () => {};

  saveModel = () => {
    this.knnClassifier.save("model.json");
  };

  onFeaturesReady = () => {
    this.classifier = ml5.imageClassifier("MobileNet", this.onClassifierReady);
  };

  onClassifierReady = () => {
    this.onLoaded();
  };

  addSample = (imageData, label) => {
    console.log("adding", label);
    const features = this.featureExtractor.infer(imageData);
    this.knnClassifier.addExample(features, label);
  };

  classify = onResult => {
    // Get the total number of labels from knnClassifier
    const numLabels = knnClassifier.getNumLabels();
    if (numLabels <= 0) {
      console.error("There is no examples in any label");
      return;
    }
    const features = this.featureExtractor.infer(getFrameImage().imageData);
    // Use knnClassifier to classify which label do these features belong to
    this.knnClassifier.classify(features, onResult);
  };
}
