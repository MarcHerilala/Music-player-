export const formatDuration = (duration: number) => {
    const minutes = Math.floor(duration / 60);
    const seconds = Math.floor(duration % 60);
    return `${minutes}:${seconds.toString().padStart(2, '0')}`;
  };

export const filter=(data:any,search:string)=>{
    return data.filter((item:any)=>item.filename.toLowerCase().includes(search.toLowerCase()))
}