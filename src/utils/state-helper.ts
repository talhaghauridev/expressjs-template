// utils/state-helper.ts
export const encodeState = (state: any): string => {
  return Buffer.from(JSON.stringify(state)).toString('base64');
};

export const decodeState = (encodedState: string): any => {
  return JSON.parse(Buffer.from(encodedState, 'base64').toString());
};
