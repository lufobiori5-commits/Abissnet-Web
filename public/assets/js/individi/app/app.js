// App Store & Play Store URLs
const ABISSNET_IOS_URL = "https://apps.apple.com/us/app/abissnet/id6745196422";
const ABISSNET_ANDROID_URL =
  "https://play.google.com/store/apps/details?id=com.abisnnet.al&hl=sq";
const IPTV_IOS_URL = "https://apps.apple.com/al/app/abissnet-tv/idXXXXXXXXX";
const IPTV_ANDROID_URL =
  "https://play.google.com/store/apps/details?id=al.abissnet.tv";

// Set Abissnet App links
["appx-ios-1", "appx-ios-2"].forEach((id) => {
  const a = document.getElementById(id);
  if (a) a.href = ABISSNET_IOS_URL || "#";
});
["appx-android-1", "appx-android-2"].forEach((id) => {
  const a = document.getElementById(id);
  if (a) a.href = ABISSNET_ANDROID_URL || "#";
});

// Set IPTV App links
["iptv-ios-1", "iptv-ios-2"].forEach((id) => {
  const a = document.getElementById(id);
  if (a) a.href = IPTV_IOS_URL || "#";
});
["iptv-android-1", "iptv-android-2"].forEach((id) => {
  const a = document.getElementById(id);
  if (a) a.href = IPTV_ANDROID_URL || "#";
});

// Reveal on scroll animation
const io = new IntersectionObserver(
  (entries) => {
    entries.forEach((e) => {
      if (e.isIntersecting) {
        e.target.classList.add("in");
        io.unobserve(e.target);
      }
    });
  },
  { threshold: 0.15 }
);
document.querySelectorAll(".appx-reveal").forEach((el) => io.observe(el));
