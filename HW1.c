#include <errno.h>
#include <string.h>
#include <stdio.h>
#include <stdlib.h>
#include <unistd.h>
#include "i2c-dev.h"
#include "i2cbusses.h"



int main()
{
    
    int board [11][11];
    int i=0,j=0;
    printf("Board:");
     printf("\n");
    for (i=0; i<11; i++) {
        for (j=0; j<11; j++) {
            board[i][j]=' ';
        }
    }
    for (i=0; i<11; i++) {
        board[0][i]='.';
            board[i][0]='.';
        }
    

    char dir='x',x=3,y=3;
    while (dir !='z') {
        printf("\n");
    for (i=0; i<11; i++)
    {
        for (j=0; j<11; j++)
        {
            printf("%c",board[i][j]);
        }
        printf("\n");
    }
    
    dir = getchar();
    
    
    switch (dir)
    {
        case 'w':
            if ((x&&y)==1) {y=y-1;
            };
            break;
            
        case 'a':
            if ((x&&y)==1) {x=x-1;};break;
            
        case 's':
            if ((x&&y)==1) {y=y+1;};break;
            
        case 'd':
            if ((x&&y)==1) {x=x+1;};break;
        
    }
            board[y][x]='x';
        
    }
    return 0;
}


    
