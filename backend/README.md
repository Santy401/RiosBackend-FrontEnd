# Docker Setup - TaskRios Backend

## Requisitos Previos
- Docker instalado
- Docker Compose instalado
- Permisos sudo

## Inicio Rápido
```bash
# Iniciar la aplicación
./start.sh

# Detener la aplicación
./stop.sh
```

## Comandos Principales
```bash
# Ver logs en tiempo real
sudo docker-compose logs -f

# Reiniciar contenedores
sudo docker-compose restart

# Reconstruir después de cambios
sudo docker-compose up --build -d
```

## Estructura Docker
- `Dockerfile`: Configuración del contenedor Node.js
- `docker-compose.yml`: Orquestación de servicios
- `start.sh`: Script de inicio automatizado
- `stop.sh`: Script de detención

## Puertos
- Backend: http://localhost:6005
- PostgreSQL: 5432 (interno)

## Solución de Problemas
1. **Puerto 5432 en uso**
   ```bash
   sudo systemctl stop postgresql
   sudo lsof -i :5432
   ```

2. **Puerto 6005 en uso**
   ```bash
   sudo lsof -i :6005
   ```

3. **Reinicio Completo**
   ```bash
   sudo docker-compose down --volumes
   sudo docker system prune -a
   ./start.sh
   ```

4. **Ver Logs**
   ```bash
   sudo docker-compose logs -f
   ```

## Notas Importantes
- Los datos persisten en el volumen `postgres_data`
- PostgreSQL local debe estar detenido
- Use `sudo` con comandos Docker
- Verifique permisos de scripts con `chmod +x`

## Desarrollo
- Los cambios en el código requieren reconstruir: `sudo docker-compose up --build -d`
- Los logs muestran errores en tiempo real
- La base de datos persiste entre reinicios

