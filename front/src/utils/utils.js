// the movies and clips can be opened from not immediate overlays
// This serves as a reference to if the nested overlays have update
// Easier than keeping tack of updated css classes when a lot of nesting
let topLevelUpdated = false;

export function combineClipEmotion(data) {
  const clipsWithEmotions = [];

  for (const clip of data) {
    const clipData = {
      ...clip,
      emotion_ids: clip.emotion_id ? [clip.emotion_id] : [],
      emotion_names: clip.emotion_name ? [clip.emotion_name] : [],
    };

    const existingClip = clipsWithEmotions.find(
      (c) => c.clip_id === clipData.clip_id
    );

    if (existingClip) {
      existingClip.emotion_names.push(...clipData.emotion_names);
      existingClip.emotion_ids.push(...clipData.emotion_ids);
    } else {
      const newClip = {
        clip_id: clipData.clip_id,
        timecode: clipData.timecode,
        description: clipData.description,
        emotion_ids: clipData.emotion_ids,
        emotion_names: clipData.emotion_names,
      };

      if (clipData.movie_name) {
        newClip.movie_name = clipData.movie_name;
      }

      if (clipData.image_url) {
        newClip.image_url = clipData.image_url;
      }

      clipsWithEmotions.push(newClip);
    }
  }

  clipsWithEmotions.sort((a, b) => {
    const aTime = convertTimecodeToSeconds(a.timecode);
    const bTime = convertTimecodeToSeconds(b.timecode);
    return aTime - bTime;
  });

  return clipsWithEmotions;
}

function convertTimecodeToSeconds(timecode) {
  const parts = timecode.split(":");
  const hours = parseInt(parts[0]);
  const minutes = parseInt(parts[1]);
  const seconds = parseInt(parts[2]);
  const frames = parseInt(parts[3]);
  const totalSeconds = hours * 3600 + minutes * 60 + seconds + frames / 30;
  return totalSeconds;
}

export function validateInputText(inputText, inputElement) {
  inputText = inputText.trim();
  if (inputText === "") {
    inputElement.value = "";
    alert("Please add an item");
    return false;
  }
  return true;
}

export function isUpdated(updateReference) {
  const updated = updateReference.classList.contains("updated");
  updateReference.classList.remove("updated");
  return updated;
}

export function update(updateReference) {
  topLevelUpdate();
  updateReference.classList.add("updated");
}

export function isTopLevelUpdated(middle) {
  const updated = topLevelUpdated;
  if (!middle) {
    topLevelUpdated = false;
  }
  return updated;
}

export function topLevelUpdate() {
  console.log("top level needs update");
  topLevelUpdated = true;
}
