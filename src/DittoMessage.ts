import moment from "moment";

type Direction = "d2t" | "t2d";

/** Message object to store cross-platform metadata */
export class DittoMessage {
    private _direction: string;
	private _discordMessageId: string;
    private _telegramMessageId: string;

    private _message: string | null;

    private _pinned: boolean;
    private _reactions: Set<string>;

    /**
	 * Creates a new Message object
	 *
	 * @param direction One of the two direction constants of this class
	 * @param discordMessageId Message ID in Discord
	 * @param telegramMessageId	Message ID in Telegram
     * @param message displayed content of message
	 */
	constructor(direction: Direction, discordMessageId: string, telegramMessageId: string, message: string | null) {
		/** The message itself */
		this._reactions = new Set();
        this._pinned = false;

        this._direction = direction;
        this._discordMessageId = discordMessageId;
        this._telegramMessageId = telegramMessageId;

        this._message = message;

        console.log(this);
	}

    get discordMessageId(): string {
        return this._discordMessageId;
    }

    get telegramMessageId(): string {
        return this._telegramMessageId;
    }

    set message(newMessage: string) {
        this._message = newMessage;
    }
}
