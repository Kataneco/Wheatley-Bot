#include <stdio.h>
#include <string.h>
#include <math.h>
int k;
double sin() ,cos();
int main(){
    float A=0, B=0, i, j, z[1760];
    char b[1760];
    printf("\x1b[2J");
    for(; ; ) {
        memset(b,32,1760);
        memset(z,0,7040);
        for(j=0; 6.28>j; j+=0.07) {
            for(i=0; 6.28 >i; i+=0.02) {
                float sini=sin(i),
                      cosj=cos(j),
                      sinA=sin(A),
                      sinj=sin(j),
                      cosA=cos(A),
                      cosj2=cosj+2,
                      mess=1/(sinicosj2sinA+sinjcosA+5),
                      cosi=cos(i),
                      cosB=cos(B),
                      sinB=sin(B),
                      t=sinicosj2cosA-sinj sinA;
                int x=40+30mess(cosicosj2cosB-tsinB),
                    y= 12+15mess(cosicosj2sinB +tcosB),
                    o=x+80y,
                    N=8((sinjsinA-sinicosjcosA)cosB-sinicosjsinA-sinjcosA-cosi cosjsinB);
                if(22>y&&y>0&&x>0&&80>x&&mess>z[o]){
                    z[o]=mess;
                    b[o]=".,-~:;=!#$@"[N>0?N:0];
                }
            }
        }
        printf("\x1b[d");
        for(k=0; 1761>k; k++)
            putchar(k%80?b[k]:10);
        A+=0.04;
        B+= 0.02;
    }
}