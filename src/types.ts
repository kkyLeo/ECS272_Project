// Global types and interfaces are stored here.
export interface Margin {
    readonly left: number;
    readonly right: number;
    readonly top: number;
    readonly bottom: number;
}

export interface ComponentSize {
    width: number;
    height: number;
}

export interface InfoProps {
    gameName: string;
}

export interface InfoGameData {
    title: string;
    introduction: string;
    genres: string;
    developer: string;
    publisher: string;
    platforms: string;
    imageURL: string; 
}

export interface RatingData {
    category: string;
    value: number; 
}

export interface RatingRetirementGameData {
    title: string;
    averageRating: number;
    retirementRate: number;
}

export interface PlayersNumberData {
    Platform: string;
    Players: number;
}

export interface PlaytimeData {
    Platform: string;
    MainStory: number;
    MainSides: number;
    Completionist: number;
    Fastest: number;
    Slowest: number;
}

export interface NodeData {
    id: string;
    type: 'game' | 'genre';
    isCurrentGame?: boolean;
    sharesAllGenres?: boolean;
}

export interface LinkData {
    source: string;
    target: string;
}