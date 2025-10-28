import SendbirdApp from "@sendbird/uikit-react/App";
const APP_ID = "DDE5E7A9-BB1F-4755-8F24-89DEAD9D744D";
const USER_ID = "37392";

export default function Chat() {
  return (
    <div style={{ height: "100vh", width: "100vw" }}>
      <SendbirdApp appId={APP_ID} userId={USER_ID} />
    </div>
  );
}
