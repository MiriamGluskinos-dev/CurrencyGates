import { ConfigService } from "./config.service";
// import { configFile } from "../../assets/settingfolder/setting.json";

export function ConfigLoader(configService: ConfigService) {
  return () => configService.load("../../assets/settingfolder/setting.json");
}
