import { Timestamp } from 'firebase/firestore';

export class User {
  constructor(
    public Email: string,
    public Discriminator: string,
    public Id: string,
    public UserName: string,
    public SelectedGuildId: string,
    public SelectedGuildName: string,
    public AccessToken: string,
    public ExpiresOn: Timestamp|string,
    public RefreshToken: string
  ) {}

}
