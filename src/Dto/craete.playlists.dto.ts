import { IsNotEmpty, IsString } from "class-validator";

export class PlaylistsDto {
  @IsString()
  @IsNotEmpty()
  name: string;

  @IsNotEmpty()
  @IsString()
  user: string
  
  songs: string[];
}
