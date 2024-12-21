

export function hashLink(length:number) {
      const str="a1b2c3d4e5f6g7h8i9jk";
      let str_length=str.length;
      let ans="";

      for(let i=0;i<str_length;i++){
            ans+=str[Math.round(Math.random()*20)];
      }
      return ans;
}